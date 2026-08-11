import { SectionHeading } from "./SectionHeading";

const pillars = [
  ["மௌனம்", "Mounam — Stillness", "A few full minutes to arrive in the body before movement begins. Stillness is not a pause from practice; it is the beginning of it."],
  ["மூச்சு", "Moochu — Breath", "Breath leads every transition. If the breath becomes strained, the shape can soften—there is no other rule to prove."],
  ["மெய்ப்பொருள்", "Meiporul — Essence", "Alignment is about what is true for your body today. Variations are an essential part of the practice, never an apology."],
];

export function Philosophy() { return <section className="philosophy" id="agam"><div className="container"><SectionHeading eyebrow="The meaning of Agam" title="Three ideas held in every class." /><div className="pillars">{pillars.map(([tamil, word, copy]) => <article className="pillar" key={word}><p className="pillar__tamil">{tamil}</p><span className="pillar__word">{word}</span><p>{copy}</p></article>)}</div></div></section>; }
