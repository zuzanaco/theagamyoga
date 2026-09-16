"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Each pool has its own origin, scale and phase; outlines never share a rigid grid.
const pools = {
  style: [[8, 15, 350], [74, 12, 480], [102, 46, 390], [37, 63, 280], [6, 86, 430], [80, 94, 540]],
  classes: [[4, 24, 400], [89, 64, 740], [43, 103, 450]],
  contact: [[4, 24, 400], [89, 64, 740], [43, 103, 450]],
};

export function SectionRings({ variant }: { variant: "style" | "classes" | "contact" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rings = Array.from(element.querySelectorAll<HTMLElement>(".water-ring"));
    let frame = 0;
    let active = false;
    let previous = 0;
    let time = 0;
    let progress = 0;
    const paint = (now: number) => {
      const rect = element.getBoundingClientRect();
      const target = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      progress += (target - progress) * .12;
      time += previous ? Math.min(now - previous, 50) / 1000 : 0;
      previous = now;
      rings.forEach((ring, index) => {
        const pool = Math.floor(index / 4);
        const phase = (progress * 2.1 + time * .055 + index % 4 * .25 + pool * .17) % 1;
        const alpha = Math.pow(Math.sin(phase * Math.PI), 1.5) * .52;
        const drift = Math.sin(progress * 5 + pool) * 35;
        ring.style.opacity = motion.matches ? ".22" : alpha.toFixed(3);
        ring.style.transform = motion.matches
          ? `scale(${.5 + index % 4 * .19})`
          : `translate(${drift}px, ${(progress - .5) * (pool % 2 ? -100 : 100)}px) rotate(${pool * 19 + progress * 24}deg) scale(${.28 + phase * 1.04}, ${.23 + phase * .86})`;
      });
      if (active && !motion.matches) frame = requestAnimationFrame(paint);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (active) frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      restart();
    });
    observer.observe(element);
    motion.addEventListener("change", restart);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); motion.removeEventListener("change", restart); };
  }, [variant]);
  return <div ref={ref} className={`section-rings section-rings--${variant}`} aria-hidden="true">
    {pools[variant].map(([x, y, size], pool) => <div className="water-pool" key={pool} style={{ left: `${x}%`, top: `${y}%`, "--pool-size": `${size}px` } as CSSProperties}>
      {[0, 1, 2, 3].map(ring => <span className={`water-ring water-ring--${(pool + ring) % 3}`} key={ring} />)}
    </div>)}
  </div>;
}
