import "server-only";
import { unstable_cache } from "next/cache";
import { google } from "googleapis";
import { siteContent } from "@/content/siteContent";
import { calendarLabels, calendarSettings } from "@/content/calendarContent";

// API page size, not a cap on the total event list.
export const CALENDAR_EVENT_LIMIT = 250;
export const CALENDAR_TIME_ZONE = calendarSettings.timeZone;
export const CALENDAR_REVALIDATE_SECONDS = calendarSettings.revalidateSeconds;

type GoogleCalendarEvent = {
  status?: string | null;
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
  lastSuccessfulFetchAt?: string;
  fetchedEventCount?: number;
  fetchWindowStart?: string;
  fetchWindowEnd?: string;
};

type CalendarSnapshot = {
  events: CalendarEvent[];
  fetchedAt: string;
  fetchedEventCount: number;
  timeMin: string;
  timeMax: string;
};

let lastSuccessfulSnapshot: CalendarSnapshot | undefined;
let lastAttempt: { at: string; succeeded: boolean } | undefined;

export function getCalendarFetchDiagnostics() {
  return lastAttempt;
}

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

function startOfCalendarMonth(year: number, monthIndex: number) {
  const date = new Date(Date.UTC(year, monthIndex, 1, 12));
  const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: CALENDAR_TIME_ZONE, timeZoneName: "longOffset" }).formatToParts(date);
  const month = parts.find(part => part.type === "month")!.value;
  const normalizedYear = parts.find(part => part.type === "year")!.value;
  const offset = parts.find(part => part.type === "timeZoneName")!.value.replace("GMT", "") || "+00:00";
  return new Date(`${normalizedYear}-${month}-01T00:00:00${offset}`).toISOString();
}

export function getCalendarFetchWindow(now = new Date()) {
  const [year, month] = monthKeyFor(now).split("-").map(Number);
  return {
    // Previous month, current month, and the next six complete months.
    timeMin: startOfCalendarMonth(year, month - 2),
    timeMax: startOfCalendarMonth(year, month + 6),
  };
}

// Render as React text, never Calendar HTML. Keep practical paragraph/line breaks.
export function calendarDescriptionText(value: string | null | undefined) {
  if (!value) return undefined;
  const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  const text = value.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<\/?(?:br|p|div|li|ul|ol|h[1-6])\b[^>]*>/gi, "\n")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity: string) => {
      if (!entity.startsWith("#")) return entities[entity.toLowerCase()] ?? match;
      const code = entity[1].toLowerCase() === "x" ? Number.parseInt(entity.slice(2), 16) : Number(entity.slice(1));
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : match;
    })
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text || undefined;
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

export function normalizeEvent(event: GoogleCalendarEvent, index: number): CalendarEvent | null {
  if (event.status === "cancelled") return null;
  const startValue = event.start?.dateTime || event.start?.date;
  if (!startValue) return null;

  const allDay = !event.start?.dateTime;
  const startDate = allDay ? allDayDate(startValue) : new Date(startValue);
  if (Number.isNaN(startDate.getTime())) return null;

  const endValue = event.end?.dateTime || event.end?.date || undefined;
  const endDate = event.end?.dateTime ? new Date(event.end.dateTime) : undefined;
  const { day, month, dateKey, monthKey } = formatDate(startDate);
  const description = calendarDescriptionText(event.description);

  return {
    id: event.id || `${startValue}-${index}`,
    title: event.summary?.trim() || calendarLabels.defaultTitle,
    description,
    location: event.location?.trim() || undefined,
    start: allDay ? startValue : startDate.toISOString(),
    end: endValue,
    allDay,
    day,
    month,
    dateKey,
    monthKey,
    dateLabel: new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: CALENDAR_TIME_ZONE }).format(startDate),
    timeLabel: allDay ? calendarLabels.allDay : endDate && !Number.isNaN(endDate.getTime()) ? `${formatTime(startDate)}–${formatTime(endDate)}` : formatTime(startDate),
    startTimestamp: startDate.getTime(),
    offeringId: getOfferingId(event.summary?.trim() || calendarLabels.defaultTitle, description),
  };
}

async function loadUpcomingCalendarEvents(calendarId: string, timeMin: string, timeMax: string): Promise<CalendarSnapshot> {
  try {
    const { serviceAccountEmail, serviceAccountPrivateKey } = getConfig();
    if (!serviceAccountEmail || !serviceAccountPrivateKey) throw new Error("Calendar credentials are incomplete");
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: serviceAccountEmail, private_key: serviceAccountPrivateKey },
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });
    const calendar = google.calendar({ version: "v3", auth });
    const rawEvents: GoogleCalendarEvent[] = [];
    const seenTokens = new Set<string>();
    let pageToken: string | undefined;
    do {
      const response = await calendar.events.list({
        calendarId, timeMin, timeMax, pageToken,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: CALENDAR_EVENT_LIMIT,
        showDeleted: false,
        timeZone: CALENDAR_TIME_ZONE,
      }, { timeout: 20000, retry: false });
      rawEvents.push(...(response.data.items || []));
      pageToken = response.data.nextPageToken || undefined;
      if (pageToken && seenTokens.has(pageToken)) throw new Error("Calendar pagination did not advance");
      if (pageToken) seenTokens.add(pageToken);
    } while (pageToken);

    const events = rawEvents.map((event, index) => normalizeEvent(event, index))
      .filter((event): event is CalendarEvent => Boolean(event))
      .sort((a, b) => a.startTimestamp - b.startTimestamp);
    const fetchedAt = new Date().toISOString();
    const snapshot = { events, fetchedAt, fetchedEventCount: rawEvents.length, timeMin, timeMax };
    lastSuccessfulSnapshot = snapshot;
    lastAttempt = { at: fetchedAt, succeeded: true };
    return snapshot;
  } catch {
    lastAttempt = { at: new Date().toISOString(), succeeded: false };
    // Avoid logging raw Google responses, credentials or event contents.
    throw new Error("Calendar request failed");
  }
}

// Cache the complete paginated snapshot once. Arguments include source and window,
// so switching Calendar IDs or crossing a month cannot reuse an unrelated list.
const getCachedUpcomingCalendarEvents = unstable_cache(loadUpcomingCalendarEvents, ["google-calendar-snapshot-v2"], {
  revalidate: CALENDAR_REVALIDATE_SECONDS,
  tags: ["google-calendar"],
});

export async function getUpcomingCalendarEvents(): Promise<CalendarResult> {
  const config = getConfig();
  const configured = Boolean(config.calendarId && config.serviceAccountEmail && config.serviceAccountPrivateKey);
  const base = { configured, calendarTimeZone: CALENDAR_TIME_ZONE, currentMonthKey: getCurrentCalendarMonthKey() };
  if (!configured) return { ...base, events: [], requestSucceeded: false };

  try {
    const { timeMin, timeMax } = getCalendarFetchWindow();
    const snapshot = await getCachedUpcomingCalendarEvents(config.calendarId!, timeMin, timeMax);
    return {
      ...base, events: snapshot.events, requestSucceeded: true,
      lastSuccessfulFetchAt: snapshot.fetchedAt, fetchedEventCount: snapshot.fetchedEventCount,
      fetchWindowStart: snapshot.timeMin, fetchWindowEnd: snapshot.timeMax,
    };
  } catch {
    return { ...base, events: [], requestSucceeded: false, lastSuccessfulFetchAt: lastSuccessfulSnapshot?.fetchedAt };
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
