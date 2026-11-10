"use client";

import { useEffect, useSyncExternalStore } from "react";

const palettes = ["original", "water"] as const;
const labels = { original: "Original", water: "Water" };
type Palette = (typeof palettes)[number];

function savedPalette(): Palette {
  try {
    const saved = window.localStorage.getItem("theagamyoga-palette");
    return saved === "water" ? "water" : "original";
  } catch {
    return "original";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("theagamyoga:palette-changed", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("theagamyoga:palette-changed", onChange);
  };
}

function selectPalette(next: Palette) {
  try { window.localStorage.setItem("theagamyoga-palette", next); } catch { /* Storage may be unavailable. */ }
  document.documentElement.dataset.palette = next;
  window.dispatchEvent(new Event("theagamyoga:palette-changed"));
}

function DevelopmentPaletteSwitcher() {
  const palette = useSyncExternalStore(subscribe, savedPalette, () => "original" as Palette);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
  }, [palette]);
  return <div className="palette-switcher" role="group" aria-label="Development color palette preview">
    {palettes.map(option => <button key={option} type="button" aria-pressed={palette === option} onClick={() => selectPalette(option)}>{labels[option]}</button>)}
  </div>;
}

export function PaletteSwitcher() {
  return process.env.NODE_ENV === "development" ? <DevelopmentPaletteSwitcher /> : null;
}
