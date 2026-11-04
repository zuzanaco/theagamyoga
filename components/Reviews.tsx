"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/content/siteContent";
import { SectionHeading } from "./SectionHeading";

export function Reviews() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedReview, setSelectedReview] = useState<number | null>(null);
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
    const observer = new ResizeObserver(updateControls);
    observer.observe(viewport);
    return () => {
      viewport.removeEventListener("scroll", updateControls);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || selectedReview === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedReview]);

  function move(direction: number) {
    const viewport = viewportRef.current;
    const card = viewport?.querySelector<HTMLElement>(".review");
    if (!viewport || !card) return;

    const track = card.parentElement!;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  return <section id="reviews">
    <div className="container"><SectionHeading eyebrow={siteContent.labels.feedbacks} title="Words from the practice." /></div>
    <div className="reviews-carousel" role="region" aria-roledescription="carousel" aria-label="Client reviews">
      <button type="button" className="gallery__arrow gallery__arrow--previous" onClick={() => move(-1)} aria-label="Previous review" aria-controls="reviews-viewport" disabled={!canGoPrevious}>←</button>
      <div id="reviews-viewport" className="reviews__viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="Reviews — scroll to read more">
        <div className="reviews__track">{siteContent.reviews.map(([quote, name], index) => <figure className="review" key={name}>
          <div className="stars" aria-label="Five stars">★★★★★</div>
          <blockquote className="review__quote">“{quote}”</blockquote>
          <figcaption>— {name}</figcaption>
          <span className="review__open-label" aria-hidden="true">Open review ↗</span>
          <button className="review__open" type="button" aria-label={`Open full review from ${name}`} aria-haspopup="dialog" onClick={() => setSelectedReview(index)} />
        </figure>)}</div>
      </div>
      <button type="button" className="gallery__arrow gallery__arrow--next" onClick={() => move(1)} aria-label="Next review" aria-controls="reviews-viewport" disabled={!canGoNext}>→</button>
    </div>
    <div className="container"><p className="review-note">A selection of client words shared with permission.</p></div>
    <dialog ref={dialogRef} className="review-modal" aria-labelledby="review-modal-name" onClose={() => setSelectedReview(null)} onClick={event => { if (event.target === event.currentTarget) setSelectedReview(null); }}>
      {selectedReview !== null && <div className="review-modal__panel">
        <div className="review-modal__header">
          <div className="stars" aria-label="Five stars">★★★★★</div>
          <button type="button" className="review-modal__close" aria-label="Close review" onClick={() => setSelectedReview(null)}>×</button>
        </div>
        <div className="review-modal__content">
          <blockquote>“{siteContent.reviews[selectedReview][0]}”</blockquote>
          <p id="review-modal-name">— {siteContent.reviews[selectedReview][1]}</p>
        </div>
      </div>}
    </dialog>
  </section>;
}
