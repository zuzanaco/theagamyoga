"use client";

import { useSiteLanguage } from "./LanguageProvider";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./SectionHeading";
import { openContactForOffering } from "./ContactForm";

export function YogaOfferings() {
  const { t } = useSiteLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const updateControls = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      setCanGoPrevious(viewport.scrollLeft > 1);
      setCanGoNext(viewport.scrollLeft < maxScroll - 1);
    };
    updateControls();
    viewport.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      viewport.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const mobile = window.matchMedia("(max-width: 699px)");
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>(".offering"));
    // Fit the leading phone offering instead of reserving the longest card's
    // height for every slide. The full approved text stays in each article.
    const fitHeight = () => {
      if (!mobile.matches) { viewport.style.removeProperty("height"); return; }
      const left = viewport.getBoundingClientRect().left;
      const active = cards.reduce<HTMLElement | null>((closest, card) => !closest || Math.abs(card.getBoundingClientRect().left - left) < Math.abs(closest.getBoundingClientRect().left - left) ? card : closest, null);
      if (active) {
        viewport.style.height = `${active.offsetHeight + 8}px`;
        if (viewport.scrollTop !== 0) viewport.scrollTop = 0;
      }
    };
    const observer = new ResizeObserver(fitHeight);
    cards.forEach(card => observer.observe(card));
    observer.observe(viewport);
    viewport.addEventListener("scroll", fitHeight, { passive: true });
    mobile.addEventListener("change", fitHeight);
    fitHeight();
    return () => { observer.disconnect(); viewport.removeEventListener("scroll", fitHeight); mobile.removeEventListener("change", fitHeight); viewport.style.removeProperty("height"); };
  }, []);

  function move(direction: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollBy({ left: direction * viewport.clientWidth * .72, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return <section id="offerings"><div className="container"><SectionHeading eyebrow={t.offeringUi.eyebrow} title={t.offeringUi.title} /><div className="offerings-carousel" aria-roledescription="carousel" aria-label={t.offeringUi.carousel}>
    <button type="button" className="offerings__arrow offerings__arrow--previous" onClick={() => move(-1)} aria-label={t.offeringUi.previous} disabled={!canGoPrevious}>←</button>
    <div className="offerings" ref={viewportRef} tabIndex={0} role="group" aria-label={t.offeringUi.carousel}>
      <div className="offerings__track">{t.offerings.map((offering) => <article className="offering" id={`offering-${offering.id}`} key={offering.id}>
        <span className="offering__number">{offering.number}</span>
        <h3>{offering.title}</h3>
        <p className="offering__tagline">{offering.tagline}</p>
        <p>{offering.text}</p>
        {offering.note && <p className="offering__note">{offering.note}</p>}
        <button type="button" className="enquiry-cta offering__enquire" onClick={() => openContactForOffering(offering.id)}>{t.offeringUi.enquire} <span aria-hidden="true">→</span></button>
      </article>)}</div>
    </div>
    <button type="button" className="offerings__arrow offerings__arrow--next" onClick={() => move(1)} aria-label={t.offeringUi.next} disabled={!canGoNext}>→</button>
  </div></div></section>;
}
