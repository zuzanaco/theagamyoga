"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { WaterNavWave } from "./WaterDividers";
import { useSiteLanguage } from "./LanguageProvider";
import { LanguageSwitch } from "./LanguageSwitch";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { t } = useSiteLanguage();
  const links = [[t.labels.about, "#about"], [t.nav.gallery, "#gallery"], [t.nav.agam, "#agam"], [t.nav.offerings, "#offerings"], [t.nav.classes, "#classes"], [t.nav.reviews, "#reviews"], [t.nav.contact, "#contact"]];

  useEffect(() => {
    if (!open) return;
    const { scrollX, scrollY } = window;
    const body = document.body;
    const trigger = triggerRef.current;
    const previous = { position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, left: `-${scrollX}px`, width: "100%", overflow: "hidden" });
    const content = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > footer"));
    const previousInert = content.map(element => element.inert);
    content.forEach(element => { element.inert = true; });
    const focusable = () => Array.from(headerRef.current?.querySelectorAll<HTMLElement>("a, button") || []).filter(element => element.getClientRects().length > 0);
    headerRef.current?.querySelector<HTMLElement>(".nav-links a")?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const elements = focusable(), first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", keydown);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", keydown);
      content.forEach((element, index) => { element.inert = previousInert[index]; });
      Object.assign(body.style, previous);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (!open || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const hash = event.currentTarget.hash;
    setOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      window.history.replaceState(null, "", hash);
    });
  }

  return <header className="site-header" ref={headerRef}><nav className="nav container" aria-label={t.nav.main}>
    <a className="brand" href="#top" aria-label={t.nav.home} onClick={navigate}>the<span>agam</span>yoga</a>
    <ul className={`nav-links${open ? " nav-links--open" : ""}`} id="nav-links">
      {links.map(([label, href]) => <li className={href === "#reviews" ? "nav-mobile-only" : undefined} key={href}><a className={href === "#contact" ? "nav-contact" : undefined} href={href} onClick={navigate}>{label}</a></li>)}
      <li className="nav-language"><LanguageSwitch /></li>
    </ul>
    <div className="nav__controls"><div className="nav__desktop-language"><LanguageSwitch /></div><button type="button" ref={triggerRef} className="menu-button" onClick={() => setOpen(value => !value)} aria-label={open ? t.nav.closeMenu : t.nav.openMenu} aria-expanded={open} aria-controls="nav-links">
      <span aria-hidden="true">{open ? "×" : "☰"}</span>
    </button></div>
  </nav><WaterNavWave /></header>;
}
