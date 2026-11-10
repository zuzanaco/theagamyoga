"use client";

import { useState } from "react";
import { WaterNavWave } from "./WaterDividers";
import { useSiteLanguage } from "./LanguageProvider";
import { LanguageSwitch } from "./LanguageSwitch";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { t } = useSiteLanguage();
  const links = [[t.labels.about, "#about"], [t.nav.gallery, "#gallery"], [t.nav.agam, "#agam"], [t.nav.offerings, "#offerings"], [t.nav.classes, "#classes"], [t.nav.contact, "#contact"]];
  return <header className="site-header"><nav className="nav container" aria-label={t.nav.main}>
    <a className="brand" href="#top" aria-label={t.nav.home}>the<span>agam</span>yoga</a>
    <ul className={`nav-links${open ? " nav-links--open" : ""}`} id="nav-links">
      {links.map(([label, href]) => <li key={href}><a className={href === "#contact" ? "nav-contact" : undefined} href={href} onClick={() => setOpen(false)}>{label}</a></li>)}
    </ul>
    <div className="nav__controls"><LanguageSwitch /><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="nav-links">
      <span className="sr-only">{t.nav.menu}</span><span aria-hidden="true">{open ? "×" : "☰"}</span>
    </button></div>
  </nav><WaterNavWave /></header>;
}
