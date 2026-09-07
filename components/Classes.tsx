import { SectionHeading } from "./SectionHeading";
import { getUpcomingCalendarEvents } from "@/lib/calendar";

export async function Classes() {
  const { events } = await getUpcomingCalendarEvents();
  return <section className="classes" id="classes"><div className="container"><SectionHeading eyebrow="Upcoming class dates" title="A little time, held for you." /><div className="classes__layout"><div className="class-list">{events.length ? events.map((event) => <article className="class-card" key={event.id}><time dateTime={new Date(event.startTimestamp).toISOString()}><b>{event.day}</b><span>{event.month}</span></time><div><h3>{event.title}</h3><p className="class-card__meta">{event.dateLabel}{event.timeLabel ? ` · ${event.timeLabel}` : ""}</p>{event.location ? <p className="class-card__detail">{event.location}</p> : null}{event.description ? <p>{event.description}</p> : null}</div></article>) : <div className="calendar-empty"><h3>No upcoming dates are scheduled right now.</h3><p>Reach out if you would like to hear about the next practice.</p></div>}</div><aside className="classes__aside"><h3>Interested in joining?</h3><p>Reach out for current dates, availability and class details.</p><a className="button button--gold" href="#contact">Get in touch</a></aside></div></div></section>;
}
