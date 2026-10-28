import { unstable_cache } from "next/cache";
import { google } from "googleapis";

export const CALENDAR_EVENT_LIMIT = 12;
export const CALENDAR_TIME_ZONE = "Europe/Berlin";
export const CALENDAR_REVALIDATE_SECONDS = 600;

type GoogleCalendarEvent = {
  id?: string | null;
  summary?: string | null;
  description?: string | null;
  location?: string | null;
  start?: { date?: string | null; dateTime?: string | null } | null;
  end?: { date?: string | null; dateTime?: string | null } | null;
};

export type CalendarEvent = {
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
  startTimestamp: number;
};

export type CalendarResult = {
  events: CalendarEvent[];
  configured: boolean;
  requestSucceeded: boolean;
  calendarTimeZone: string;
};

type CalendarConfig = {
  calendarId?: string;
  serviceAccountEmail?: string;
  serviceAccountPrivateKey?: string;
};

function getConfig(): CalendarConfig {
  return {
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    serviceAccountPrivateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };
}

function formatDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: CALENDAR_TIME_ZONE }).formatToParts(date);
  return {
    day: parts.find((part) => part.type === "day")?.value || "",
    month: parts.find((part) => part.type === "month")?.value || "",
  };
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: CALENDAR_TIME_ZONE }).format(date);
}

function allDayDate(date: string) {
  return new Date(`${date}T12:00:00Z`);
}

function normalizeEvent(event: GoogleCalendarEvent, index: number): CalendarEvent | null {
  const startValue = event.start?.dateTime || event.start?.date;
  if (!startValue) return null;

  const allDay = !event.start?.dateTime;
  const startDate = allDay ? allDayDate(startValue) : new Date(startValue);
  if (Number.isNaN(startDate.getTime())) return null;

  const endValue = event.end?.dateTime || event.end?.date || undefined;
  const endDate = event.end?.dateTime ? new Date(event.end.dateTime) : undefined;
  const { day, month } = formatDate(startDate);
  const description = event.description?.trim().replace(/\s+/g, " ");

  return {
    id: event.id || `${startValue}-${index}`,
    title: event.summary?.trim() || "Yoga class",
    description: description ? `${description.slice(0, 240)}${description.length > 240 ? "…" : ""}` : undefined,
    location: event.location?.trim() || undefined,
    start: allDay ? startValue : startDate.toISOString(),
    end: endValue,
    allDay,
    day,
    month,
    dateLabel: new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: CALENDAR_TIME_ZONE }).format(startDate),
    timeLabel: allDay ? "All day" : endDate && !Number.isNaN(endDate.getTime()) ? `${formatTime(startDate)}–${formatTime(endDate)}` : formatTime(startDate),
    startTimestamp: startDate.getTime(),
  };
}

async function loadUpcomingCalendarEvents(): Promise<CalendarEvent[]> {
  const { calendarId, serviceAccountEmail, serviceAccountPrivateKey } = getConfig();
  if (!calendarId || !serviceAccountEmail || !serviceAccountPrivateKey) throw new Error("Calendar credentials are incomplete");

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: serviceAccountEmail, private_key: serviceAccountPrivateKey },
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: CALENDAR_EVENT_LIMIT,
    showDeleted: false,
  });

  return (response.data.items || [])
    .map((event, index) => normalizeEvent(event, index))
    .filter((event): event is CalendarEvent => Boolean(event))
    .sort((a, b) => a.startTimestamp - b.startTimestamp);
}

const getCachedUpcomingCalendarEvents = unstable_cache(loadUpcomingCalendarEvents, ["google-calendar-upcoming"], {
  revalidate: CALENDAR_REVALIDATE_SECONDS,
  tags: ["google-calendar"],
});

export async function getUpcomingCalendarEvents(): Promise<CalendarResult> {
  const config = getConfig();
  const configured = Boolean(config.calendarId && config.serviceAccountEmail && config.serviceAccountPrivateKey);
  if (!configured) return { events: [], configured: false, requestSucceeded: false, calendarTimeZone: CALENDAR_TIME_ZONE };

  try {
    const events = await getCachedUpcomingCalendarEvents();
    return { events, configured: true, requestSucceeded: true, calendarTimeZone: CALENDAR_TIME_ZONE };
  } catch (error) {
    console.warn("[calendar] Unable to load upcoming events", error instanceof Error ? error.message : "Unknown calendar error");
    return { events: [], configured: true, requestSucceeded: false, calendarTimeZone: CALENDAR_TIME_ZONE };
  }
}

export function getCalendarConfigStatus() {
  const config = getConfig();
  return {
    calendarIdConfigured: Boolean(config.calendarId),
    serviceAccountEmailConfigured: Boolean(config.serviceAccountEmail),
    serviceAccountPrivateKeyConfigured: Boolean(config.serviceAccountPrivateKey),
    configuredTimeZone: CALENDAR_TIME_ZONE,
  };
}
