"use client";

import { useState } from "react";

const palettes = ["original", "water", "pink"] as const;
const labels = { original: "Original", water: "Water", pink: "Pink" };
type Palette = (typeof palettes)[number];

function savedPalette(): Palette {
  if (typeof window === "undefined") return "original";
  const saved = window.localStorage.getItem("theagamyoga-palette");
  return saved && palettes.includes(saved as Palette) ? saved as Palette : "original";
}

function applyPalette(next: Palette) {
  window.document.documentElement.dataset.palette = next;
  window.localStorage.setItem("theagamyoga-palette", next);
}

export function PaletteSwitcher() {
  const [palette, setPalette] = useState<Palette>(savedPalette);

  function selectPalette(next: Palette) {
    applyPalette(next);
    setPalette(next);
  }

  return <div className="palette-switcher" role="group" aria-label="Temporary color palette switcher">
    {palettes.map((option) => <button key={option} type="button" aria-pressed={palette === option} onClick={() => selectPalette(option)}>{labels[option]}</button>)}
  </div>;
}
