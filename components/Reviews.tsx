import { siteContent } from "@/content/siteContent";
import { SectionHeading } from "./SectionHeading";

export function Reviews() { return <section id="reviews"><div className="container"><SectionHeading eyebrow="Student notes" title="Words from the practice." /><div className="reviews">{siteContent.reviews.map(([quote, name]) => <figure className="review" key={name}><div className="stars" aria-label="Five stars">★★★★★</div><blockquote>“{quote}”</blockquote><figcaption>— {name}</figcaption></figure>)}</div><p className="review-note">A selection of client words shared with permission.</p></div></section>; }
