"use client";

import type { KeyboardEvent, SyntheticEvent } from "react";

function ripplePath(r: number) {
  return `M 0 ${-r} C ${r * .58} ${-r * 1.03}, ${r * 1.02} ${-r * .55}, ${r} 0 C ${r * .98} ${r * .58}, ${r * .52} ${r * 1.02}, 0 ${r * .96} C ${-r * .59} ${r * .91}, ${-r * 1.02} ${r * .52}, ${-r * .96} 0 C ${-r * .91} ${-r * .56}, ${-r * .56} ${-r * .97}, 0 ${-r} Z`;
}

const principles = [
  { href: "#agam-essence", label: "Go to Essence — Meiporul" },
  { href: "#agam-breath", label: "Go to Breath — Moochu" },
  { href: "#agam-stillness", label: "Go to Stillness — Mounam" },
];

function navigateToPrinciple(event: SyntheticEvent<HTMLAnchorElement>, href: string) {
  event.preventDefault();
  const id = href.slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.dispatchEvent(new CustomEvent("theagamyoga:principle-navigate", { detail: { id } }));
  target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  window.history.replaceState(null, "", href);
}

export function HeroRings() {
  return <svg className="hero-visual__ring-svg" viewBox="0 0 400 400">
    {[188, 158, 128].map((radius, index) => <a className={`hero-orbit-link hero-orbit-link--${index}`} href={principles[index].href} aria-label={principles[index].label} onClick={(event) => navigateToPrinciple(event, principles[index].href)} onKeyDown={(event: KeyboardEvent<HTMLAnchorElement>) => { if (event.key === " ") navigateToPrinciple(event, principles[index].href); }} key={radius}>
      <g className={`hero-orbit hero-orbit--${index}`} transform={`translate(200 200) rotate(${index * 37})`}>
        <path className="hero-orbit__hit" d={ripplePath(radius)} />
        <path className="hero-orbit__line" d={ripplePath(radius)} />
      </g>
    </a>)}
  </svg>;
}
