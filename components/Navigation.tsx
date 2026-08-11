"use client";

import { useState } from "react";

const links = [
  ["About", "#about"],
  ["Agam", "#agam"],
  ["Offerings", "#offerings"],
  ["Classes", "#classes"],
  ["Contact", "#contact"],
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><nav className="nav container" aria-label="Main navigation">
    <a className="brand" href="#top" aria-label="theagamyoga home">the<span>agam</span>yoga</a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="nav-links">
      <span className="sr-only">Toggle menu</span><span aria-hidden="true">{open ? "×" : "☰"}</span>
    </button>
    <ul className={`nav-links${open ? " nav-links--open" : ""}`} id="nav-links">
      {links.map(([label, href]) => <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>)}
    </ul>
  </nav></header>;
}
