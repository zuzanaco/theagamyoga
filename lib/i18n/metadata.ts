import type { Metadata } from "next";
import type { Language } from "./translations";

export function localizedMetadata(language: Language): Metadata {
  const english = language === "en";
  const path = english ? "/" : "/de";
  return {
    metadataBase: new URL("https://theagamyoga.com"),
    title: english ? "theagamyoga | Hatha Yoga in Cologne" : "theagamyoga | Hatha Yoga in Köln",
    description: english ? "AGAM Yoga with Anitha Ramalingam in Cologne: Hatha Yoga, Hatha–Vinyasa and Yoga Nidra rooted in a practice of turning inward." : "AGAM Yoga mit Anitha Ramalingam in Köln: Hatha Yoga, Hatha–Vinyasa und Yoga Nidra, verwurzelt in einer Praxis der Hinwendung nach innen.",
    alternates: { canonical: path, languages: { en: "/", de: "/de", "x-default": "/" } },
    openGraph: {
      title: english ? "theagamyoga | Hatha Yoga in Cologne" : "theagamyoga | Hatha Yoga in Köln",
      description: english ? "A Hatha Yoga practice rooted in turning inward with Anitha Ramalingam in Cologne." : "Eine Hatha-Yoga-Praxis der Hinwendung nach innen mit Anitha Ramalingam in Köln.",
      url: `https://theagamyoga.com${english ? "" : path}`, siteName: "theagamyoga", type: "website", locale: english ? "en_GB" : "de_DE", alternateLocale: english ? "de_DE" : "en_GB",
    },
  };
}
