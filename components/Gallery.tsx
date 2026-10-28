"use client";

import Image from "next/image";
import { useRef } from "react";
import { siteContent } from "@/content/siteContent";

export function Gallery() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const images = siteContent.galleryImages;

  function move(direction: number) {
    viewportRef.current?.scrollBy({ left: direction * viewportRef.current.clientWidth * .72, behavior: "smooth" });
  }

  return <section className="gallery" id="gallery" aria-label="Practice images">
    <div className="gallery__carousel container" aria-roledescription="carousel" aria-label="Yoga practice gallery">
      <button type="button" className="gallery__arrow gallery__arrow--previous" onClick={() => move(-1)} aria-label="Scroll to previous gallery images">←</button>
      <div className="gallery__viewport" ref={viewportRef}>
        <div className="gallery__track">{images.map((image) => <div className="gallery__item" key={image.src}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 560px) 70vw, (max-width: 960px) 30vw, 18rem" /></div>)}</div>
      </div>
      <button type="button" className="gallery__arrow gallery__arrow--next" onClick={() => move(1)} aria-label="Scroll to next gallery images">→</button>
      <p className="gallery__note">Some images are temporary placeholders and can be replaced later.</p>
    </div>
  </section>;
}
