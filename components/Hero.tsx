"use client";

import { useSiteLanguage } from "./LanguageProvider";

import Image from "next/image";
import { HeroRings } from "./HeroRings";

export function Hero() {
  const { t } = useSiteLanguage();
  return <section className="hero" id="top">
    <div className="container hero__grid">
      <div className="hero__content">
        <h1>{t.hero.first}{" "}<br />{t.hero.before}<em>{t.hero.emphasis}</em>{t.hero.after}</h1>
        <div className="button-row"><a className="button" href="#classes">{t.hero.classes}</a><a className="button button--outline" href="#about">{t.labels.meetAnitha}</a></div>
      </div>
      <div className="hero-visual">
        <div className="hero-visual__rings">
          <HeroRings />
          <div className="hero-visual__photo"><Image src="/images/hero-yoga-v2.png" alt={t.hero.photo} fill priority sizes="(max-width: 860px) 80vw, 420px" /></div>
        </div>
      </div>
    </div>
  </section>;
}
