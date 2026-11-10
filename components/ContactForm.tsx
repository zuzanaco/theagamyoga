"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteContent } from "@/content/siteContent";
import { useSiteLanguage } from "./LanguageProvider";
import { dateLocale } from "@/lib/i18n/translations";

export type ContactEventContext = {
  title: string;
  date: string;
  time: string;
  location?: string;
  dateKey?: string;
};

const eventStorageKey = "theagamyoga-selected-event";
const formspreeEndpoint = "https://formspree.io/f/meaazowp";
const successDelayMs = 1500;

// Calendar display text is shortened only here; submitted event data stays intact.
function compactEventDate(date: string) {
  return date.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/, day => day.slice(0, 3))
    .replace(/,\s*/, " ")
    .replace(/\b(January|February|March|April|June|July|August|September|October|November|December)\b/g, month => month.slice(0, 3));
}

function readStoredEvent() {
  try {
    const value = window.sessionStorage.getItem(eventStorageKey);
    return value ? JSON.parse(value) as ContactEventContext : null;
  } catch {
    return null;
  }
}

function openContactModal(offeringId?: string, useStoredEvent = true) {
  window.dispatchEvent(new CustomEvent("theagamyoga:open-contact", { detail: { offeringId, useStoredEvent } }));
}

export function ContactForm() {
  const { language, t } = useSiteLanguage();
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [eventContext, setEventContext] = useState<ContactEventContext | null>(null);
  const [selectedType, setSelectedType] = useState("general");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const offeringOptions = useMemo(() => siteContent.offerings.map((offering) => ({
    id: `offering:${offering.id}`,
    label: offering.title,
    displayLabel: t.form.offerings[offering.id] || offering.title,
  })), [t.form.offerings]);
  const selectedLabel = selectedType === "event" ? eventContext?.title || "Selected class" : offeringOptions.find((option) => option.id === selectedType)?.label || "General enquiry";

  useEffect(() => {
    const updateEvent = () => setEventContext(readStoredEvent());
    const openModal = (event: Event) => {
      const detail = (event as CustomEvent<{ offeringId?: string; useStoredEvent?: boolean }>).detail;
      const offeringId = detail?.offeringId;
      const storedEvent = detail?.useStoredEvent === false ? null : readStoredEvent();
      setEventContext(storedEvent);
      setSelectedType(offeringId ? `offering:${offeringId}` : storedEvent ? "event" : "general");
      setStatus("idle");
      setIsOpen(true);
    };
    updateEvent();
    window.addEventListener("theagamyoga:event-selected", updateEvent);
    window.addEventListener("theagamyoga:open-contact", openModal);
    return () => {
      window.removeEventListener("theagamyoga:event-selected", updateEvent);
      window.removeEventListener("theagamyoga:open-contact", openModal);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const { scrollX, scrollY } = window;
    const bodyStyle = document.body.style;
    const previousStyles = { position: bodyStyle.position, top: bodyStyle.top, left: bodyStyle.left, right: bodyStyle.right, width: bodyStyle.width, overflow: bodyStyle.overflow, paddingRight: bodyStyle.paddingRight };
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyPadding = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    Object.assign(bodyStyle, { position: "fixed", top: `-${scrollY}px`, left: `-${scrollX}px`, right: "0", width: "100%", overflow: "hidden", paddingRight: `${bodyPadding + scrollbarWidth}px` });

    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]') || [])
      .filter(element => element.offsetParent !== null && (!(element instanceof HTMLInputElement) || element.type !== "radio" || element.checked));
    panel?.querySelector<HTMLButtonElement>(".contact-modal__close")?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const keepFocusInside = (event: FocusEvent) => {
      if (event.target instanceof Node && !panel?.contains(event.target)) focusable()[0]?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", keepFocusInside);
    return () => {
      requestRef.current?.abort();
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
      Object.assign(bodyStyle, previousStyles);
      previousFocus?.focus({ preventScroll: true });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || status !== "success") return;
    const timer = window.setTimeout(() => {
      formRef.current?.reset();
      try { window.sessionStorage.removeItem(eventStorageKey); } catch { /* Storage may be unavailable. */ }
      setEventContext(null);
      setSelectedType("general");
      setStatus("idle");
      setIsOpen(false);
    }, successDelayMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, status]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    if (!name || !email || !formElement.checkValidity()) {
      setErrorMessage(t.form.validation);
      setStatus("error");
      formElement.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }

    const subject = selectedType === "event" && eventContext ? `Class enquiry — ${eventContext.title} — ${eventContext.date}` : `${selectedLabel} — theagamyoga`;
    form.set("_subject", subject);
    form.set("enquiry_type", selectedLabel);
    form.set("interface_language", language === "de" ? "German" : "English");
    if (selectedType === "event" && eventContext) {
      form.set("event_title", eventContext.title);
      form.set("event_date", eventContext.date);
      form.set("event_time", eventContext.time);
      if (eventContext.location) form.set("event_location", eventContext.location);
    }

    const controller = new AbortController();
    requestRef.current = controller;
    setIsSubmitting(true);
    try {
      const response = await fetch(formspreeEndpoint, { method: "POST", body: form, headers: { Accept: "application/json" }, signal: controller.signal });
      if (!response.ok) throw new Error("Form submission failed");
      if (controller.signal.aborted) return;
      formElement.reset();
      try { window.sessionStorage.removeItem(eventStorageKey); } catch { /* Storage may be unavailable. */ }
      setStatus("success");
    } catch {
      if (controller.signal.aborted) return;
      setErrorMessage(t.form.failure);
      setStatus("error");
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsSubmitting(false);
      }
    }
  }

  return <>
    <button type="button" className="button button--gold enquiry-cta contact-form__open" onClick={() => openContactModal(undefined, false)}>{t.form.open}</button>
    {isOpen && typeof document !== "undefined" && createPortal(<div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
      <div className="contact-modal__panel" ref={panelRef}>
        <div className="contact-modal__header">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 id="contact-modal-title">{t.form.open}</h2>
          <button type="button" className="contact-modal__close" onClick={() => setIsOpen(false)} aria-label={t.form.close}>×</button>
        </div>
        <div className="contact-modal__content">
          <form ref={formRef} className="contact-form" onSubmit={submit} noValidate aria-busy={isSubmitting}>
            <fieldset className="contact-form__types">
              <legend>{t.form.question}</legend>
              {eventContext && <label className="contact-form__event-option"><input type="radio" name="enquiryType" checked={selectedType === "event"} onChange={() => setSelectedType("event")} /> <span><strong>{t.form.specific}</strong><span className="contact-form__event-title">{eventContext.title}</span><small>{language === "de" && eventContext.dateKey ? new Intl.DateTimeFormat(dateLocale(language), { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Berlin" }).format(new Date(`${eventContext.dateKey}T12:00:00Z`)) : compactEventDate(eventContext.date)} · {eventContext.time === "All day" ? t.calendar.allDay : eventContext.time}</small>{eventContext.location && <small>{eventContext.location}</small>}</span></label>}
              {offeringOptions.map((option) => <label className="contact-form__type-option" key={option.id}><input type="radio" name="enquiryType" checked={selectedType === option.id} onChange={() => setSelectedType(option.id)} /> <span>{option.displayLabel}</span></label>)}
              <label className="contact-form__type-option"><input type="radio" name="enquiryType" checked={selectedType === "general"} onChange={() => setSelectedType("general")} /> <span>{t.form.general}</span></label>
            </fieldset>
            <div className="contact-form__fields">
              <label>{t.form.name}<input name="name" type="text" autoComplete="name" required /></label>
              <label>{t.form.email}<input name="email" type="email" autoComplete="email" required /></label>
              <label className="contact-form__phone-field"><span>{t.form.phone} <small>{t.form.optional}</small></span><input name="phone" type="tel" autoComplete="tel" /></label>
              <label className="contact-form__message-field"><span>{t.form.message} <small>{t.form.optional}</small></span><textarea name="message" rows={4} /></label>
            </div>
            {status === "error" && <p className="contact-form__message contact-form__message--error" role="alert">{errorMessage}</p>}
            {status === "success" && <p className="contact-form__message" role="status">{t.form.success}</p>}
            <button className="button button--gold enquiry-cta" type="submit" disabled={isSubmitting || status === "success"}>{isSubmitting ? t.form.sending : t.form.submit}</button>
          </form>
        </div>
      </div>
    </div>, document.body)}
  </>;
}

export function openContactForOffering(offeringId: string) {
  openContactModal(offeringId, false);
}
