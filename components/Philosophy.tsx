import { SectionRings } from "./SectionRings";
import { SectionHeading } from "./SectionHeading";
import { siteContent } from "@/content/siteContent";

export function Philosophy() { return <section className="philosophy" id="agam"><SectionRings variant="style" /><div className="container"><SectionHeading eyebrow={siteContent.labels.style} title="Three ideas behind every class I teach" /><div className="pillars">{siteContent.principles.map(([tamil, word, copy]) => <article className="pillar" key={word}><p className="pillar__tamil">{tamil}</p><span className="pillar__word">{word}</span><p>{copy}</p></article>)}</div></div></section>; }
