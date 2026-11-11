"use client";

import { useSyncExternalStore } from "react";

type CalendarEventDisplay = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end?: string;
  allDay: boolean;
  day: string;
  month: string;
  dateLabel: string;
  timeLabel?: string;
};

type DisplayTime = Pick<CalendarEventDisplay, "day" | "month" | "dateLabel" | "timeLabel">;

function formatDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).formatToParts(date);
  return {
    day: parts.find((part) => part.type === "day")?.value || "",
    month: parts.find((part) => part.type === "month")?.value || "",
  };
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

function localDisplay(event: CalendarEventDisplay): DisplayTime {
  if (event.allDay) return event;

  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : undefined;
  if (Number.isNaN(start.getTime())) return event;

  const { day, month } = formatDateParts(start);
  return {
    day,
    month,
    dateLabel: new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(start),
    timeLabel: end && !Number.isNaN(end.getTime()) ? `${formatTime(start)}–${formatTime(end)}` : formatTime(start),
  };
}

export function CalendarEventCard({ event }: { event: CalendarEventDisplay }) {
  const browserReady = useSyncExternalStore(() => () => {}, () => true, () => false);
  const display = browserReady ? localDisplay(event) : event;

  return <article className="class-card"><time dateTime={event.start}><b>{display.day}</b><span>{display.month}</span></time><div><h3>{event.title}</h3><p className="class-card__meta">{display.dateLabel}{display.timeLabel ? ` · ${display.timeLabel}` : ""}</p>{event.location ? <p className="class-card__detail">{event.location}</p> : null}{event.description ? <p>{event.description}</p> : null}</div></article>;
}
