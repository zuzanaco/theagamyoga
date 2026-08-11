import { SectionHeading } from "./SectionHeading";

const reviews = [
  ["“[Placeholder testimonial] I left feeling grounded, open, and much more at home in my body.”", "— Student name"],
  ["“[Placeholder testimonial] The pace is gentle but never vague. Every cue gives you room to listen.”", "— Student name"],
  ["“[Placeholder testimonial] A genuinely welcoming class—quiet, warm, and beautifully held.”", "— Student name"],
];

export function Reviews() { return <section id="reviews"><div className="container"><SectionHeading eyebrow="Student notes" title="Words from the practice." /><div className="reviews">{reviews.map(([quote, name]) => <figure className="review" key={quote}><div className="stars" aria-label="Five stars">★★★★★</div><blockquote>{quote}</blockquote><figcaption>{name}</figcaption></figure>)}</div><p className="review-note">[Replace these placeholders with approved client testimonials. Review submission is intentionally not enabled.]</p></div></section>; }
