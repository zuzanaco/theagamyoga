"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/content/siteContent";
import { SectionHeading } from "./SectionHeading";

function ReviewCard({ quote, name, index }: { quote: string; name: string; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const quoteId = `review-quote-${index}`;

  useEffect(() => {
    const element = quoteRef.current;
    if (!element) return;

    const measure = () => {
      if (!expanded) setIsExpandable(element.scrollHeight > element.clientHeight + 1);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [expanded]);

  return <figure className="review">
    <div className="stars" aria-label="Five stars">★★★★★</div>
    <blockquote id={quoteId} ref={quoteRef} className={`review__quote${expanded ? " review__quote--expanded" : ""}`}>“{quote}”</blockquote>
    {isExpandable && <button className="review__toggle" type="button" aria-controls={quoteId} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "SHOW LESS" : "READ ON"}</button>}
    <figcaption>— {name}</figcaption>
  </figure>;
}

export function Reviews() { return <section id="reviews"><div className="container"><SectionHeading eyebrow={siteContent.labels.feedbacks} title="Words from the practice." /><div className="reviews">{siteContent.reviews.map(([quote, name], index) => <ReviewCard key={name} quote={quote} name={name} index={index} />)}</div><p className="review-note">A selection of client words shared with permission.</p></div></section>; }
