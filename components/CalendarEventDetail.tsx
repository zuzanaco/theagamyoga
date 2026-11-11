"use client";

import { useEffect, useId, useRef, useState } from "react";
import { calendarSettings } from "@/content/calendarContent";
import { useSiteLanguage } from "./LanguageProvider";
import { dateLocale } from "@/lib/i18n/translations";
import type { CalendarEvent } from "@/lib/calendar";

function EventDescription({ text }: { text: string }) {
  const { t } = useSiteLanguage();
  const calendarLabels = t.calendar;
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const descriptionId = useId();

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;
    const measure = () => {
      if (!expanded) setOverflows(paragraph.scrollHeight > paragraph.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(paragraph);
    return () => observer.disconnect();
  }, [text, expanded]);

  return <div className="calendar-description">
    <p id={descriptionId} ref={paragraphRef} className={`calendar-description__text${expanded ? " calendar-description__text--expanded" : ""}`}>{text}</p>
    {overflows && <button className="calendar-description__toggle" type="button" aria-controls={descriptionId} aria-expanded={expanded} onClick={() => setExpanded(current => !current)}>{expanded ? calendarLabels.showLess : calendarLabels.readMore}</button>}
  </div>;
}

export function CalendarEventDetail({ event, onEnquire }: { event: CalendarEvent; onEnquire: (event: CalendarEvent) => void }) {
  const { language, t } = useSiteLanguage();
  const calendarLabels = t.calendar;
  const titleId = useId();
  const date = new Intl.DateTimeFormat(dateLocale(language), { weekday: "long", day: "numeric", month: "long", timeZone: calendarSettings.timeZone }).format(new Date(`${event.dateKey}T12:00:00Z`));

  return <section className="month-calendar__event-detail" aria-labelledby={titleId}>
    <h3 id={titleId}>{event.title}</h3>
    <dl className="calendar-event-meta">
      <div><dt className="sr-only">{calendarLabels.date}</dt><dd><time dateTime={event.dateKey}>{date}</time></dd></div>
      <div><dt className="sr-only">{calendarLabels.time}</dt><dd>{event.allDay ? calendarLabels.allDay : <time dateTime={event.start}>{event.timeLabel}</time>}</dd></div>
      {event.location && <div><dt className="sr-only">{calendarLabels.location}</dt><dd className="calendar-event-meta__location">{event.location}</dd></div>}
    </dl>
    {event.description && <EventDescription key={event.id} text={event.description} />}
    <div className="month-calendar__actions">
      <button type="button" className="button button--gold enquiry-cta" onClick={() => onEnquire(event)}>{calendarLabels.enquire}</button>
      {event.offeringId && <a className="month-calendar__offering-link" href={`#offering-${event.offeringId}`}>{calendarLabels.viewOffering} <span aria-hidden="true">→</span></a>}
    </div>
  </section>;
}
