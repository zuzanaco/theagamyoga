"use client";

import { useEffect } from "react";

const PHASES = [1, -0.75, 0.6, -0.9];

function deformPath(kind: string | undefined, amount: number) {
  if (kind === "nav") {
    return `M0 0H1440V36C1280 ${33 + amount * 6} 1140 ${6 - amount * 5} 980 ${28 + amount * 5}C820 ${43 - amount * 5} 700 ${41 + amount * 5} 520 ${30 - amount * 4}C340 ${17 + amount * 4} 180 ${15 - amount * 5} 0 38Z`;
  }
  if (kind === "ribbon") {
    return `M0 0H1530V38C1370 ${94 - amount * 8} 1360 ${95 - amount * 7} 1145 ${50 + amount * 8}C930 ${5 - amount * 8} 755 ${8 + amount * 7} 550 ${54 - amount * 9}C345 ${100 + amount * 8} 170 ${6 - amount * 7} 0 56Z`;
  }
  return `M0 64C180 ${18 + amount * 8} 340 ${20 - amount * 7} 520 ${50 + amount * 8}C700 ${80 - amount * 8} 820 ${92 + amount * 6} 980 ${48 - amount * 8}C1140 ${6 + amount * 7} 1280 ${20 - amount * 6} 1440 58V100H0Z`;
}

export function WaterWaveMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const paths = Array.from(document.querySelectorAll<SVGPathElement>(".water-wave-motion-path"));
    let animationFrame = 0;
    let stopTimer = 0;
    let target = 0;
    let current = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();

    const render = () => {
      const waterActive = root.dataset.palette === "water" && !reducedMotion.matches;
      if (!waterActive) {
        target = 0;
      }
      current += (target - current) * 0.08;
      paths.forEach((path, index) => {
        const phase = PHASES[index % PHASES.length];
        path.setAttribute("d", deformPath(path.dataset.waterWaveKind, current * phase));
      });
      if (target === 0 && Math.abs(current) < 0.0001) {
        current = 0;
        paths.forEach((path) => {
          path.setAttribute("d", deformPath(path.dataset.waterWaveKind, 0));
        });
      }
      if (Math.abs(current - target) > 0.0001 || target !== 0) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        animationFrame = 0;
      }
    };

    const schedule = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
    };

    const onScroll = () => {
      const now = performance.now();
      const elapsed = Math.max(16, now - lastTime);
      const velocity = (window.scrollY - lastY) / elapsed;
      lastY = window.scrollY;
      lastTime = now;
      target = Math.max(-1, Math.min(1, velocity * 0.5));
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        target = 0;
        schedule();
      }, 110);
      schedule();
    };

    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        target = 0;
        schedule();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    reducedMotion.addEventListener("change", onReducedMotionChange);
    schedule();
    return () => {
      window.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      window.clearTimeout(stopTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
