"use client";

import { useSiteLanguage } from "./LanguageProvider";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { siteContent } from "@/content/siteContent";

export function Gallery() {
  const { t } = useSiteLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const images = siteContent.galleryImages;
  const loopedImages = Array.from({ length: 5 }, () => images).flat();

  useEffect(() => {
    const viewport = viewportRef.current;
    const firstItem = viewport?.querySelector<HTMLElement>(".gallery__item");
    if (!viewport || !firstItem) return;

    let cycleWidth = 0;
    const phase = (position: number, cycle: number) => ((position % cycle) + cycle) % cycle;
    // Each copy is visually identical. Shift by whole cycles instantly so
    // the same photos stay in the same positions, with room on either side.
    const recenter = () => {
      if (!cycleWidth) return;
      const left = viewport.scrollLeft;
      const next = cycleWidth * 2 + phase(left, cycleWidth);
      if (Math.abs(next - left) > 1) viewport.scrollTo({ left: next, behavior: "instant" });
    };
    const keepRoomToScroll = () => {
      if (viewport.scrollLeft < cycleWidth * .5 || viewport.scrollLeft > cycleWidth * 3.5) recenter();
    };
    const measure = () => {
      const gap = Number.parseFloat(getComputedStyle(firstItem.parentElement!).columnGap) || 0;
      const nextCycle = (firstItem.getBoundingClientRect().width + gap) * images.length;
      if (Math.abs(nextCycle - cycleWidth) < .01) return;
      const progress = cycleWidth ? phase(viewport.scrollLeft, cycleWidth) / cycleWidth : 0;
      cycleWidth = nextCycle;
      viewport.scrollTo({ left: cycleWidth * (2 + progress), behavior: "instant" });
    };

    measure();
    viewport.addEventListener("scroll", keepRoomToScroll, { passive: true });
    viewport.addEventListener("scrollend", recenter);
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(firstItem);
    return () => {
      viewport.removeEventListener("scroll", keepRoomToScroll);
      viewport.removeEventListener("scrollend", recenter);
      observer.disconnect();
    };
  }, [images.length]);

  function move(direction: number) {
    const viewport = viewportRef.current;
    const firstItem = viewport?.querySelector<HTMLElement>(".gallery__item");
    if (!viewport || !firstItem) return;
    const gap = Number.parseFloat(getComputedStyle(firstItem.parentElement!).columnGap) || 0;
    const step = firstItem.getBoundingClientRect().width + gap;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollBy({ left: direction * step, behavior: reducedMotion ? "instant" : "smooth" });
  }

  return <section className="gallery" id="gallery" aria-label={t.gallery.label}>
    <div className="gallery__carousel container" aria-roledescription="carousel" aria-label={t.gallery.carousel}>
      <button type="button" className="gallery__arrow gallery__arrow--previous" onClick={() => move(-1)} aria-label={t.gallery.previous}>←</button>
      <div className="gallery__viewport" ref={viewportRef}>
        <div className="gallery__track">{loopedImages.map((image, index) => <div className="gallery__item" key={`${index}-${image.src}`}><Image src={image.src} alt={t.gallery.alts[index % images.length]} fill sizes="(max-width: 560px) 70vw, (max-width: 960px) 30vw, 18rem" /></div>)}</div>
      </div>
      <button type="button" className="gallery__arrow gallery__arrow--next" onClick={() => move(1)} aria-label={t.gallery.next}>→</button>
    </div>
  </section>;
}
