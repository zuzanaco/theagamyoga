import { SectionHeading } from "./SectionHeading";

const offerings = [
  ["01", "Slow flow", "A grounding, all-levels class that follows the breath with generous time for each posture."],
  ["02", "Deep rest", "A quiet restorative practice supported by props, soft light, and long exhalations."],
  ["03", "Private practice", "One-to-one sessions shaped around your needs, questions, and current season."],
];

export function YogaOfferings() { return <section id="offerings"><div className="container"><SectionHeading eyebrow="Ways to practise" title="Find the pace that meets you." /><div className="offerings">{offerings.map(([number, title, copy]) => <article className="offering" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p><a href="#contact">Enquire <span aria-hidden="true">→</span></a></article>)}</div></div></section>; }
