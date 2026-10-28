"use client";

import { useEffect, useMemo, useState } from "react";
import { siteContent } from "@/content/siteContent";

export type ContactEventContext = {
  title: string;
  date: string;
  time: string;
  location?: string;
};

const eventStorageKey = "theagamyoga-selected-event";

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
  const [eventContext, setEventContext] = useState<ContactEventContext | null>(null);
  const [selectedType, setSelectedType] = useState("general");
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const offeringOptions = useMemo(() => siteContent.offerings.map((offering) => ({ id: `offering:${offering.id}`, label: offering.title })), []);
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
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (!name || !email) { setStatus("error"); return; }

    const subject = selectedType === "event" && eventContext ? `Class enquiry — ${eventContext.title} — ${eventContext.date}` : `${selectedLabel} — theagamyoga`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "Phone: Not provided",
      "",
      `Enquiry type: ${selectedLabel}`,
      ...(selectedType === "event" && eventContext ? [`Class: ${eventContext.title}`, `Date: ${eventContext.date}`, `Time: ${eventContext.time}`, ...(eventContext.location ? [`Location: ${eventContext.location}`] : [])] : []),
      "",
      "Message",
      message || "No additional message provided.",
    ].join("\n");

    try {
      window.location.href = `mailto:${siteContent.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return <>
    <button type="button" className="button button--gold enquiry-cta contact-form__open" onClick={() => openContactModal(undefined, false)}>Send an enquiry</button>
    {isOpen && <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
      <div className="contact-modal__panel">
        <button type="button" className="contact-modal__close" onClick={() => setIsOpen(false)} aria-label="Close enquiry form">×</button>
        <span className="eyebrow">Practise together</span>
        <h2 id="contact-modal-title">Send an enquiry</h2>
        <form className="contact-form" onSubmit={submit} noValidate>
          <fieldset className="contact-form__types">
            <legend>What would you like to enquire about?</legend>
            {eventContext && <label><input type="radio" name="enquiryType" checked={selectedType === "event"} onChange={() => setSelectedType("event")} /> <span><strong>Specific date</strong><small>{eventContext.title}</small><small>{eventContext.date} · {eventContext.time}</small>{eventContext.location && <small>{eventContext.location}</small>}</span></label>}
            {offeringOptions.map((option) => <label key={option.id}><input type="radio" name="enquiryType" checked={selectedType === option.id} onChange={() => setSelectedType(option.id)} /> <span>{option.label}</span></label>)}
            <label><input type="radio" name="enquiryType" checked={selectedType === "general"} onChange={() => setSelectedType("general")} /> <span>General enquiry</span></label>
          </fieldset>
          <div className="contact-form__fields">
            <label>Name<input name="name" type="text" autoComplete="name" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" /></label>
            <label className="contact-form__message-field">Message <span>(optional)</span><textarea name="message" rows={4} /></label>
          </div>
          {status === "error" && <p className="contact-form__message contact-form__message--error" role="alert">Please enter your name and a valid email address.</p>}
          {status === "success" && <p className="contact-form__message" role="status">Thank you — your enquiry has been prepared in your email app. Please send the email to complete it.</p>}
          <button className="button button--gold enquiry-cta" type="submit">Send enquiry</button>
        </form>
      </div>
    </div>}
  </>;
}

export function openContactForOffering(offeringId: string) {
  openContactModal(offeringId, false);
}
