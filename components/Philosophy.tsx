import { SectionRings } from "./SectionRings";
import { SectionHeading } from "./SectionHeading";

const pillars = [
  ["மௌனம்", "Mounam — Stillness", "I open and close every class in real silence. Not a formality — I give you a few full minutes to arrive in the body before any movement begins."],
  ["மூச்சு", "Moochu — Breath", "I let breath lead every movement, never the other way round. If your breath gets short, I'll tell you the pose is too big — that's the only rule I hold to."],
  ["மெய்ப்பொருள்", "Meiporul — Essence", "My alignment cues are about what's true for your body that day, not a textbook shape. I offer modifications freely — you'll never need to apologize for taking them."],
];

export function Philosophy() { return <section className="philosophy" id="agam"><SectionRings variant="style" /><div className="container"><SectionHeading eyebrow="My Style" title="Three ideas behind every class I teach" /><div className="pillars">{pillars.map(([tamil, word, copy]) => <article className="pillar" key={word}><p className="pillar__tamil">{tamil}</p><span className="pillar__word">{word}</span><p>{copy}</p></article>)}</div></div></section>; }
