import { unstable_cache } from "next/cache";
import { google } from "googleapis";
import { siteContent } from "@/content/siteContent";

export const CALENDAR_EVENT_LIMIT = 250;
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
  dateKey: string;
  monthKey: string;
  dateLabel: string;
  timeLabel?: string;
  startTimestamp: number;
  offeringId?: string;
};

export type CalendarResult = {
  events: CalendarEvent[];
  configured: boolean;
  requestSucceeded: boolean;
  calendarTimeZone: string;
  currentMonthKey: string;
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
  const parts = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: CALENDAR_TIME_ZONE }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "";
  const monthNumber = parts.find((part) => part.type === "month")?.value || "";
  const dayNumber = parts.find((part) => part.type === "day")?.value || "";
  return {
    day: dayNumber,
    month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: CALENDAR_TIME_ZONE }).format(date),
    dateKey: `${year}-${monthNumber}-${dayNumber}`,
    monthKey: `${year}-${monthNumber}`,
  };
}

function monthKeyFor(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { month: "2-digit", year: "numeric", timeZone: CALENDAR_TIME_ZONE }).formatToParts(date);
  return `${parts.find((part) => part.type === "year")?.value || ""}-${parts.find((part) => part.type === "month")?.value || ""}`;
}

export function getCurrentCalendarMonthKey() {
  return monthKeyFor(new Date());
}

function getCalendarFetchWindow() {
  const now = new Date();
  return {
    timeMin: new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), 1)).toISOString(),
    timeMax: new Date(Date.UTC(now.getUTCFullYear() + 1, now.getUTCMonth() + 2, 0, 23, 59, 59)).toISOString(),
  };
}

function normalizedTitle(value: string) {
  return value.toLowerCase().replace(/[–—]/g, "-").replace(/[^a-z0-9]+/g, " ").trim();
}

function getOfferingId(title: string, description?: string) {
  const metadataId = description?.match(/(?:^|\s)offering\s*:\s*([a-z0-9-]+)/i)?.[1];
  if (metadataId && siteContent.offerings.some((offering) => offering.id === metadataId)) return metadataId;
  return siteContent.offerings.find((offering) => normalizedTitle(offering.title) === normalizedTitle(title))?.id;
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
  const { day, month, dateKey, monthKey } = formatDate(startDate);
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
    dateKey,
    monthKey,
    dateLabel: new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: CALENDAR_TIME_ZONE }).format(startDate),
    timeLabel: allDay ? "All day" : endDate && !Number.isNaN(endDate.getTime()) ? `${formatTime(startDate)}–${formatTime(endDate)}` : formatTime(startDate),
    startTimestamp: startDate.getTime(),
    offeringId: getOfferingId(event.summary?.trim() || "Yoga class", description),
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
  const { timeMin, timeMax } = getCalendarFetchWindow();
  const response = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
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
  const currentMonthKey = getCurrentCalendarMonthKey();
  if (!configured) return { events: [], configured: false, requestSucceeded: false, calendarTimeZone: CALENDAR_TIME_ZONE, currentMonthKey };

  try {
    const events = await getCachedUpcomingCalendarEvents();
    return { events, configured: true, requestSucceeded: true, calendarTimeZone: CALENDAR_TIME_ZONE, currentMonthKey };
  } catch (error) {
    console.warn("[calendar] Unable to load upcoming events", error instanceof Error ? error.message : "Unknown calendar error");
    return { events: [], configured: true, requestSucceeded: false, calendarTimeZone: CALENDAR_TIME_ZONE, currentMonthKey };
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
