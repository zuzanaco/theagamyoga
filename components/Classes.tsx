import { SectionRings } from "./SectionRings";
import { CalendarEventCard } from "./CalendarEventCard";
import { CalendarTimeZoneNote } from "./CalendarTimeZoneNote";
import { SectionHeading } from "./SectionHeading";
import { getUpcomingCalendarEvents } from "@/lib/calendar";

export async function Classes() {
  const { events } = await getUpcomingCalendarEvents();
  return <section className="classes" id="classes"><svg className="classes__wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C180 5 330 5 500 48 S800 94 990 54 S1280 8 1440 32 V100 H0 Z" /></svg><SectionRings variant="classes" /><div className="container"><SectionHeading eyebrow="Upcoming class dates" title="A little time, held for you." />{events.length ? <CalendarTimeZoneNote /> : null}<div className="classes__layout"><div className="class-list">{events.length ? events.map((event) => <CalendarEventCard event={event} key={event.id} />) : <div className="calendar-empty"><h3>No upcoming dates are scheduled right now.</h3><p>Reach out if you would like to hear about the next practice.</p></div>}</div><aside className="classes__aside"><h3>Interested in joining?</h3><p>Reach out for current dates, availability and class details.</p><a className="button button--gold" href="#contact">Get in touch</a></aside></div></div></section>;
}
