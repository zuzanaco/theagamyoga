import Image from "next/image";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return <section id="about">
    <div className="container about">
      <div className="about__photo"><Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85" alt="Yoga teacher in a calm studio" fill sizes="(max-width: 860px) 100vw, 35vw" /></div>
      <div className="about__copy"><SectionHeading eyebrow="About the practice" title="A place to return to yourself." />
        <p><strong>[Replace with teacher introduction.]</strong> This is a placeholder for the story, lineage, and intention behind theagamyoga.</p>
        <p>Classes move slowly, with spacious holds and unhurried transitions. The invitation is to notice what is present rather than chase a particular shape.</p>
        <p>The practice welcomes first-time students and long-time practitioners alike, with options offered freely and without performance.</p><p className="signature">— Anitha Ramalingam</p>
      </div>
    </div>
  </section>;
}
