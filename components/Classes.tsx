import { SectionHeading } from "./SectionHeading";

const classes = [
  { day: "12", month: "Sep", title: "Slow evening flow", meta: "18:30 · [Studio name, Cologne]", text: "A soft landing at the end of the day, with slow movement and a long rest.", level: "All levels" },
  { day: "19", month: "Sep", title: "Saturday morning practice", meta: "10:00 · [Studio name, Cologne]", text: "An unhurried full-body practice to begin the weekend with clarity and warmth.", level: "Beginner friendly" },
  { day: "28", month: "Sep", title: "Rest & restore", meta: "16:00 · [Venue to be confirmed]", text: "A restorative workshop with blankets, bolsters, and a spacious closing meditation.", level: "All levels" },
];

export function Classes() { return <section className="classes" id="classes"><div className="container"><SectionHeading eyebrow="Upcoming classes" title="A little time, held for you." /><div className="classes__layout"><div className="class-list">{classes.map((item) => <article className="class-card" key={item.title}><time><b>{item.day}</b><span>{item.month}</span></time><div><h3>{item.title}</h3><p className="class-card__meta">{item.meta}</p><p>{item.text}</p><span className="tag">{item.level}</span></div></article>)}</div><aside className="classes__aside"><h3>Join a class</h3><p>Class information above is placeholder content. To book a place, please get in touch directly.</p><a className="button button--gold" href="#contact">Get in touch</a><p className="small-note">[Replace with booking link or booking instructions.]</p></aside></div></div></section>; }
