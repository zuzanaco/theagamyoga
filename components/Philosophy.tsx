"use client";

import { useSiteLanguage } from "./LanguageProvider";

import { useEffect, useRef, useState } from "react";
import { SectionRings } from "./SectionRings";
import { SectionHeading } from "./SectionHeading";

const principleIds = ["agam-stillness", "agam-breath", "agam-essence"];
const highlightDurationMs = 4500;

export function Philosophy() {
  const { t } = useSiteLanguage();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      if (!id || !principleIds.includes(id)) return;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setHighlightedId(null);
      window.requestAnimationFrame(() => setHighlightedId(id));
      timerRef.current = window.setTimeout(() => setHighlightedId(null), highlightDurationMs);
    };
    window.addEventListener("theagamyoga:principle-navigate", handleNavigate);
    return () => {
      window.removeEventListener("theagamyoga:principle-navigate", handleNavigate);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return <section className="philosophy" id="agam"><SectionRings variant="style" /><div className="container"><SectionHeading eyebrow={t.labels.style} title={t.philosophyTitle} /><div className="pillars">{t.principles.map(([tamil, word, copy], index) => <article className={`pillar pillar--${index}${highlightedId === principleIds[index] ? " pillar--highlighted" : ""}`} id={principleIds[index]} key={word}><p className="pillar__tamil">{tamil}</p><span className="pillar__word">{word}</span><p>{copy}</p></article>)}</div></div></section>;
}
