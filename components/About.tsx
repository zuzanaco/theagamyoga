import Image from "next/image";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return <section id="about">
    <div className="container about">
      <div className="about__photo"><Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85" alt="Yoga teacher in a calm studio" fill sizes="(max-width: 860px) 100vw, 35vw" /></div>
      <div className="about__copy"><SectionHeading eyebrow="About the practice" title="A Journey Rooted in Tradition. Evolving with You." />
        <p>My yoga journey began around the age of eight, when I learned traditional yoga from an acharya at Rama Krishna Mutt in Chennai. It has remained part of my life ever since.</p>
        <p>Today, my teaching is rooted in traditional yoga and formal Hatha Yoga training, shaped by experience with individual clients, groups, children, corporate sessions, prenatal yoga, adapted practice, meditation and Yoga Nidra. I have also taught students internationally through virtual sessions.</p>
        <p>Every body arrives with a different history, so the practice is adapted to the individual. The invitation is to understand what you are doing, listen with care and build a practice that can stay with you.</p>
        <div className="about__special"><h3>What makes the journey special?</h3><p>Some clients have stayed with me for more than two years — and continue their practice with me today. Because for me, yoga isn&apos;t about completing a class. It&apos;s about building a practice you can stay with.</p><p>Now, with my move to Germany, I bring this experience into a new chapter.</p></div>
        <div className="about__credentials"><span className="eyebrow">Experience &amp; training</span><p><strong>RYT 200 Hatha Yoga Teacher</strong> · <strong>CYT100 Prenatal Yoga Teacher</strong> · 1000+ teaching hours</p><p>100+ online clients across India, the USA, Canada, Singapore and Malaysia, with experience across individual, group, family and corporate settings.</p></div>
        <p className="signature">— Anitha Ramalingam</p>
      </div>
    </div>
  </section>;
}
