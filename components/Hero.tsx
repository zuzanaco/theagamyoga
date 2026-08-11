import Image from "next/image";

export function Hero() {
  return <section className="hero" id="top">
    <div className="container hero__grid">
      <div className="hero__content">
        <span className="eyebrow">Anitha Ramalingam · Cologne, Germany</span>
        <h1>Yoga is the practice<br />of turning <em>inward</em>.</h1>
        <p className="hero__lede">A slow, breath-led space rooted in <em>agam</em>—the Tamil word for inner landscape. Come as you are, and make room to listen.</p>
        <div className="button-row"><a className="button" href="#classes">View classes</a><a className="button button--outline" href="#about">Meet your teacher</a></div>
      </div>
      <div className="hero-visual">
        <span className="hero-visual__disc hero-visual__disc--large" /><span className="hero-visual__disc hero-visual__disc--small" /><span className="hero-visual__block" />
        <div className="hero-visual__photo"><Image src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85" alt="Placeholder hero photo of an outdoor yoga practice" fill priority sizes="(max-width: 860px) 80vw, 420px" /><span>Replace with<br />hero photography</span></div>
      </div>
    </div>
  </section>;
}
