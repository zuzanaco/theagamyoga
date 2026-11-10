"use client";

import { useSiteLanguage } from "./LanguageProvider";

import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { WaterRibbonWave } from "./WaterDividers";

export function About() {
  const { t } = useSiteLanguage();
  return <section id="about"><WaterRibbonWave />
    <div className="container about">
      <div className="about__photo"><Image src="/images/about-yoga-v2.png" alt={t.about.photo} fill sizes="(max-width: 860px) 100vw, 35vw" /></div>
      <div className="about__copy"><SectionHeading eyebrow={t.labels.about} title="Anitha Ramalingam" />
        <div className="about__story"><p>{t.about.story[0]}</p><p>{t.about.story[1]}</p><p>{t.about.story[2]}</p><p>{t.about.story[3]}</p><p>{t.about.story[4]}</p><p>{t.about.story[5]}</p><p className="about__closing-line">{t.about.story[6]}</p></div>
      </div><div className="about__facts"><svg className="about__facts-wave" aria-hidden="true" viewBox="0 0 1440 100" preserveAspectRatio="none"><path className="water-wave-motion-path about__facts-wave-current" d="M0 64 C180 18 340 20 520 50 C700 80 820 92 980 48 C1140 6 1280 20 1440 58 V100 H0Z" /><path className="about__facts-wave-original" d="M0 72 C180 18 360 18 540 58 C720 98 900 98 1080 58 C1260 18 1350 18 1440 72 V100 H0Z" /></svg><svg className="about__facts-wave about__facts-wave-bottom" aria-hidden="true" viewBox="0 0 1440 100" preserveAspectRatio="none"><path className="about__facts-wave-original" d="M0 72 C180 18 360 18 540 58 C720 98 900 98 1080 58 C1260 18 1350 18 1440 72 V100 H0Z" /></svg><div className="about__stats" aria-label={t.about.experience}><div><strong>RYT 200</strong><span>{t.about.stats[0]}</span></div><div><strong>CYT100</strong><span>{t.about.stats[1]}</span></div><div><strong>1000+</strong><span>{t.about.stats[2]}</span></div><div><strong>100+</strong><span>{t.about.stats[3]}</span></div><div><strong>30+</strong><span>{t.about.stats[4]}</span></div></div><div className="about__groups"><span className="eyebrow">{t.about.teaching}</span><div className="about__tags"><span>{t.about.groups[0]}</span><span>{t.about.groups[1]}</span><span>{t.about.groups[2]}</span><span>{t.about.groups[3]}</span><span>{t.about.groups[4]}</span><span>{t.about.groups[5]}</span><span>{t.about.groups[6]}</span><span>{t.about.groups[7]}</span><span>{t.about.groups[8]}</span></div></div></div><div className="about__callouts"><div className="about__hatha"><p><strong>{t.about.hathaLead}</strong>{t.about.hathaBody}</p></div><div className="about__special"><h3>{t.about.special}</h3><p>{t.about.specialBody}</p><p>{t.about.chapter}</p></div></div><p className="signature">{t.about.signature}</p>
    </div>
  </section>;
}
