import Image from "next/image";
import { siteContent } from "@/content/siteContent";
import { HeroRings } from "./HeroRings";

export function Hero() {
  return <section className="hero" id="top">
    <div className="container hero__grid">
      <div className="hero__content">
        <h1>Yoga is the practice<br />of turning <em>inward</em>.</h1>
        <div className="button-row"><a className="button" href="#classes">View classes</a><a className="button button--outline" href="#about">{siteContent.labels.meetAnitha}</a></div>
      </div>
      <div className="hero-visual">
        <div className="hero-visual__rings">
          <HeroRings />
          <div className="hero-visual__photo"><Image src="/images/hero-yoga-v2.png" alt="Yoga practice by the sea" fill priority sizes="(max-width: 860px) 80vw, 420px" /></div>
        </div>
      </div>
    </div>
  </section>;
}
