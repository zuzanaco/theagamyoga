import Image from "next/image";

export function Hero() {
  return <section className="hero" id="top">
    <div className="container hero__grid">
      <div className="hero__content">
        <h1>Yoga is the practice<br />of turning <em>inward</em>.</h1>
        <div className="button-row"><a className="button" href="#classes">View classes</a><a className="button button--outline" href="#about">Meet your teacher</a></div>
      </div>
      <div className="hero-visual">
        <span className="hero-visual__disc hero-visual__disc--large" /><span className="hero-visual__disc hero-visual__disc--small" /><span className="hero-visual__block" />
        <div className="hero-visual__photo"><Image src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85" alt="Outdoor yoga practice" fill priority sizes="(max-width: 860px) 80vw, 420px" /></div>
      </div>
    </div>
  </section>;
}
