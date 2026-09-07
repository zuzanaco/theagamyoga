const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars";
export const CALENDAR_EVENT_LIMIT = 8;

type GoogleCalendarEvent = {
  id?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { date?: string; dateTime?: string; timeZone?: string };
  end?: { date?: string; dateTime?: string; timeZone?: string };
};

type GoogleCalendarResponse = {
  timeZone?: string;
  items?: GoogleCalendarEvent[];
};

export type CalendarEvent = {
  id: string;
  title: string;
  day: string;
  month: string;
  dateLabel: string;
  timeLabel?: string;
  location?: string;
  description?: string;
  startTimestamp: number;
};

export type CalendarResult = {
  events: CalendarEvent[];
  configured: boolean;
  requestSucceeded: boolean;
  calendarTimeZone?: string;
  error?: string;
};

function getConfig() {
  return {
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    apiKey: process.env.GOOGLE_CALENDAR_API_KEY,
    fallbackTimeZone: process.env.GOOGLE_CALENDAR_TIMEZONE || "Europe/Berlin",
  };
}

function formatDate(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone }).formatToParts(date);
  return { day: parts.find((part) => part.type === "day")?.value || "", month: parts.find((part) => part.type === "month")?.value || "" };
}

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(date);
}

function normalizeEvent(event: GoogleCalendarEvent, calendarTimeZone: string, index: number): CalendarEvent | null {
  const dateValue = event.start?.dateTime || event.start?.date;
  if (!dateValue) return null;

  const isAllDay = !event.start?.dateTime;
  const start = isAllDay ? new Date(`${dateValue}T12:00:00Z`) : new Date(dateValue);
  if (Number.isNaN(start.getTime())) return null;

  const timeZone = event.start?.timeZone || calendarTimeZone;
  const { day, month } = formatDate(start, timeZone);
  const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;
  const timeLabel = isAllDay ? "All day" : end && !Number.isNaN(end.getTime()) ? `${formatTime(start, timeZone)} – ${formatTime(end, timeZone)}` : formatTime(start, timeZone);
  const description = event.description?.trim().replace(/\s+/g, " ");

  return {
    id: event.id || `${dateValue}-${index}`,
    title: event.summary?.trim() || "Yoga class",
    day,
    month,
    dateLabel: new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone }).format(start),
    timeLabel,
    location: event.location?.trim() || undefined,
    description: description ? `${description.slice(0, 240)}${description.length > 240 ? "…" : ""}` : undefined,
    startTimestamp: start.getTime(),
  };
}

export async function getUpcomingCalendarEvents(): Promise<CalendarResult> {
  const { calendarId, apiKey, fallbackTimeZone } = getConfig();
  const configured = Boolean(calendarId && apiKey);
  if (!configured) return { events: [], configured: false, requestSucceeded: false, calendarTimeZone: fallbackTimeZone };

  const params = new URLSearchParams({ key: apiKey as string, timeMin: new Date().toISOString(), singleEvents: "true", orderBy: "startTime", maxResults: String(CALENDAR_EVENT_LIMIT), showDeleted: "false" });
  const url = `${CALENDAR_API}/${encodeURIComponent(calendarId as string)}/events?${params.toString()}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Google Calendar returned ${response.status}`);
    const payload = (await response.json()) as GoogleCalendarResponse;
    const calendarTimeZone = payload.timeZone || fallbackTimeZone;
    const events = (payload.items || []).map((event, index) => normalizeEvent(event, calendarTimeZone, index)).filter((event): event is CalendarEvent => Boolean(event)).sort((a, b) => a.startTimestamp - b.startTimestamp);
    return { events, configured, requestSucceeded: true, calendarTimeZone };
  } catch (error) {
    console.warn("[calendar] Unable to load upcoming events", error);
    return { events: [], configured, requestSucceeded: false, calendarTimeZone: fallbackTimeZone, error: error instanceof Error ? error.message : "Unknown calendar error" };
  }
}

export function getCalendarConfigStatus() {
  const { calendarId, apiKey, fallbackTimeZone } = getConfig();
  return { calendarIdConfigured: Boolean(calendarId), apiKeyConfigured: Boolean(apiKey), configuredTimeZone: fallbackTimeZone };
}
