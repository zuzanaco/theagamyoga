import Image from "next/image";
import { siteContent } from "@/content/siteContent";

function ripplePath(r: number) {
  return `M 0 ${-r} C ${r * .58} ${-r * 1.03}, ${r * 1.02} ${-r * .55}, ${r} 0 C ${r * .98} ${r * .58}, ${r * .52} ${r * 1.02}, 0 ${r * .96} C ${-r * .59} ${r * .91}, ${-r * 1.02} ${r * .52}, ${-r * .96} 0 C ${-r * .91} ${-r * .56}, ${-r * .56} ${-r * .97}, 0 ${-r} Z`;
}

export function Hero() {
  return <section className="hero" id="top">
    <div className="container hero__grid">
      <div className="hero__content">
        <h1>Yoga is the practice<br />of turning <em>inward</em>.</h1>
        <div className="button-row"><a className="button" href="#classes">View classes</a><a className="button button--outline" href="#about">{siteContent.labels.meetAnitha}</a></div>
      </div>
      <div className="hero-visual">
        <div className="hero-visual__rings">
          <svg className="hero-visual__ring-svg" viewBox="0 0 400 400" aria-hidden="true">
            {[188, 158, 128].map((radius, index) => <g className={`hero-orbit hero-orbit--${index}`} key={radius} transform={`translate(200 200) rotate(${index * 37})`}>
              <path className="hero-orbit__hit" d={ripplePath(radius)} />
              <path className="hero-orbit__line" d={ripplePath(radius)} />
            </g>)}
          </svg>
          <div className="hero-visual__photo"><Image src="/images/hero-yoga-v2.png" alt="Yoga practice by the sea" fill priority sizes="(max-width: 860px) 80vw, 420px" /></div>
        </div>
      </div>
    </div>
  </section>;
}
