"use client";

import { useMemo, useState } from "react";
import type { CalendarEvent } from "@/lib/calendar";
import type { ContactEventContext } from "./ContactForm";
import { dateLocale, getTranslations, type Language } from "@/lib/i18n/translations";
import { useSiteLanguage } from "./LanguageProvider";
import { CalendarEventDetail } from "./CalendarEventDetail";

type MonthCalendarProps = {
  events: CalendarEvent[];
  initialMonthKey: string;
  calendarTimeZone: string;
};


function monthDate(monthKey: string) {
  return new Date(`${monthKey}-01T12:00:00`);
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function dateKey(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).formatToParts(date);
  return `${parts.find((part) => part.type === "year")?.value}-${parts.find((part) => part.type === "month")?.value}-${parts.find((part) => part.type === "day")?.value}`;
}

function monthLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

function calendarDays(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const count = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)];
}

function eventTime(event: CalendarEvent, language: Language = "en") {
  return event.allDay ? getTranslations(language).calendar.allDay : event.timeLabel || getTranslations(language).calendar.allDay;
}

function enquireAbout(event: CalendarEvent) {
  const context: ContactEventContext = { title: event.title, date: event.dateLabel, time: eventTime(event), dateKey: event.dateKey, ...(event.location ? { location: event.location } : {}) };
  window.sessionStorage.setItem("theagamyoga-selected-event", JSON.stringify(context));
  window.dispatchEvent(new Event("theagamyoga:event-selected"));
  window.dispatchEvent(new CustomEvent("theagamyoga:open-contact"));
}

export function MonthCalendar({ events, initialMonthKey, calendarTimeZone }: MonthCalendarProps) {
  const { language, t } = useSiteLanguage();
  const calendarLabels = t.calendar;
  const locale = dateLocale(language);
  const weekdays = calendarLabels.weekdays;
  const [visibleMonthKey, setVisibleMonthKey] = useState(initialMonthKey);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const visibleMonth = monthDate(visibleMonthKey);
  const todayKey = dateKey(new Date(), calendarTimeZone);
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEvent[]>();
    events.forEach((event) => grouped.set(event.dateKey, [...(grouped.get(event.dateKey) || []), event]));
    return grouped;
  }, [events]);
  const selectedEvents = selectedDateKey ? eventsByDate.get(selectedDateKey) || [] : [];
  const selectedEvent = selectedEvents.find((event) => event.id === selectedEventId) || selectedEvents[0];
  const days = calendarDays(visibleMonth);

  function showDate(nextDateKey: string) {
    setSelectedDateKey(nextDateKey);
    setSelectedEventId(eventsByDate.get(nextDateKey)?.[0]?.id || null);
  }

  function shiftMonth(amount: number) {
    const next = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1);
    setVisibleMonthKey(monthKey(next));
    setSelectedDateKey(null);
    setSelectedEventId(null);
  }

  function showToday() {
    setVisibleMonthKey(initialMonthKey);
    showDate(todayKey);
  }

  return <div className="month-calendar">
    <div className="month-calendar__main"><div className="month-calendar__toolbar">
      <div className="month-calendar__month-controls">
        <button type="button" className="month-calendar__arrow" onClick={() => shiftMonth(-1)} aria-label={calendarLabels.previous}>←</button>
        <h3 aria-live="polite">{monthLabel(visibleMonth, locale)}</h3>
        <button type="button" className="month-calendar__arrow" onClick={() => shiftMonth(1)} aria-label={calendarLabels.next}>→</button>
      </div>
      <button type="button" className="month-calendar__today" onClick={showToday}>{calendarLabels.today}</button>
    </div>
    <div className="month-calendar__grid" role="grid" aria-label={`${monthLabel(visibleMonth, locale)} ${calendarLabels.grid}`}>
      {weekdays.map((weekday) => <div className="month-calendar__weekday" role="columnheader" key={weekday}>{weekday}</div>)}
      {days.map((day, index) => {
        if (!day) return <div className="month-calendar__day month-calendar__day--empty" role="gridcell" aria-hidden="true" key={`empty-${index}`} />;
        const key = `${visibleMonthKey}-${String(day).padStart(2, "0")}`;
        const dayEvents = eventsByDate.get(key) || [];
        return <button type="button" className={`month-calendar__day${key === todayKey ? " month-calendar__day--today" : ""}${key === selectedDateKey ? " month-calendar__day--selected" : ""}`} role="gridcell" aria-selected={key === selectedDateKey} aria-label={`${day}${language === "de" ? "." : ""} ${monthLabel(visibleMonth, locale)}${dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? calendarLabels.classSingular : calendarLabels.classPlural}` : `, ${calendarLabels.noClasses}`}`} onClick={() => showDate(key)} key={key}>
          <span className="month-calendar__day-number">{day}</span>
          <span className="month-calendar__events">{dayEvents.slice(0, 2).map((event) => <span className="month-calendar__event" key={event.id}><i aria-hidden="true" />{event.title}<small>{eventTime(event, language)}</small></span>)}{dayEvents.length > 2 && <span className="month-calendar__more">+{dayEvents.length - 2} {calendarLabels.more}</span>}</span>
        </button>;
      })}
    </div></div>
    <aside className="month-calendar__side month-calendar__details" aria-live="polite">
      <div className="month-calendar__details-heading"><span className="eyebrow">{selectedEvent ? calendarLabels.selectedEvent : calendarLabels.selectedDate}</span>{!selectedEvent && <h3>{selectedDateKey ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${selectedDateKey}T12:00:00`)) : calendarLabels.chooseDay}</h3>}</div>
      {selectedEvent ? <CalendarEventDetail key={selectedEvent.id} event={selectedEvent} onEnquire={enquireAbout} /> : <p className="month-calendar__empty-detail">{calendarLabels.empty}</p>}
      {selectedEvents.length > 1 && <div className="month-calendar__event-list" aria-label={calendarLabels.dayClasses}>{selectedEvents.map((event) => <button type="button" className={event.id === selectedEvent?.id ? "month-calendar__event-choice month-calendar__event-choice--selected" : "month-calendar__event-choice"} onClick={() => setSelectedEventId(event.id)} key={event.id}>{event.title}<span>{eventTime(event, language)}</span></button>)}</div>}
    </aside>
  </div>;
}
