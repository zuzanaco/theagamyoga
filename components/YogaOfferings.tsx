import { SectionHeading } from "./SectionHeading";
import { siteContent } from "@/content/siteContent";

export function YogaOfferings() { return <section id="offerings"><div className="container"><SectionHeading eyebrow="Current offerings" title="Build a practice from within." /><div className="offerings">{siteContent.offerings.map((offering) => <article className="offering" key={offering.number}><h3>{offering.title}</h3><p className="offering__tagline">{offering.tagline}</p><p>{offering.text}</p>{offering.note && <p className="offering__note">{offering.note}</p>}<a href="#contact">Enquire <span aria-hidden="true">→</span></a></article>)}</div></div></section>; }
