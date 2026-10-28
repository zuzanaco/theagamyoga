"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { siteContent } from "@/content/siteContent";

export function Gallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const images = siteContent.galleryImages;
  const loopedImages = [...images, ...images, ...images];

  useEffect(() => {
    const viewport = viewportRef.current;
    const firstItem = viewport?.querySelector<HTMLElement>(".gallery__item");
    if (!viewport || !firstItem) return;
    const gap = Number.parseFloat(window.getComputedStyle(firstItem.parentElement!).columnGap) || 0;
    const step = firstItem.getBoundingClientRect().width + gap;
    viewport.scrollLeft = step * images.length;
  }, [images.length]);

  function move(direction: number) {
    const viewport = viewportRef.current;
    const firstItem = viewport?.querySelector<HTMLElement>(".gallery__item");
    if (!viewport || !firstItem) return;
    const gap = Number.parseFloat(window.getComputedStyle(firstItem.parentElement!).columnGap) || 0;
    const step = firstItem.getBoundingClientRect().width + gap;
    const nextScroll = viewport.scrollLeft + direction * step;
    const copyStart = step * images.length;
    const copyEnd = step * images.length * 2;

    if (direction > 0 && nextScroll >= copyEnd) {
      viewport.scrollTo({ left: nextScroll, behavior: "smooth" });
      window.setTimeout(() => {
        viewport.scrollTo({ left: copyStart, behavior: "auto" });
      }, 450);
      return;
    }
    if (direction < 0 && nextScroll <= copyStart - step) {
      viewport.scrollTo({ left: nextScroll, behavior: "smooth" });
      window.setTimeout(() => {
        viewport.scrollTo({ left: copyEnd - step, behavior: "auto" });
      }, 450);
      return;
    }
    viewport.scrollTo({ left: nextScroll, behavior: "smooth" });
  }

  return <section className="gallery" id="gallery" aria-label="Practice images">
    <div className="gallery__carousel container" aria-roledescription="carousel" aria-label="Yoga practice gallery">
      <button type="button" className="gallery__arrow gallery__arrow--previous" onClick={() => move(-1)} aria-label="Scroll to previous gallery images">←</button>
      <div className="gallery__viewport" ref={viewportRef}>
        <div className="gallery__track">{loopedImages.map((image, index) => <div className="gallery__item" key={`${index}-${image.src}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 560px) 70vw, (max-width: 960px) 30vw, 18rem" /></div>)}</div>
      </div>
      <button type="button" className="gallery__arrow gallery__arrow--next" onClick={() => move(1)} aria-label="Scroll to next gallery images">→</button>
      <p className="gallery__note">Some images are temporary placeholders and can be replaced later.</p>
    </div>
  </section>;
}
