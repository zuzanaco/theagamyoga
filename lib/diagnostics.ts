import { CALENDAR_REVALIDATE_SECONDS, getCalendarConfigStatus, getCalendarFetchDiagnostics, type CalendarResult } from "./calendar";

export type DiagnosticStatus = "Ready" | "Missing configuration" | "Pending integration" | "Error";
export type Diagnostic = { group: string; label: string; status: DiagnosticStatus; detail?: string };

export function buildDiagnostics(calendar: CalendarResult): Diagnostic[] {
  const calendarConfig = getCalendarConfigStatus();
  const lastAttempt = getCalendarFetchDiagnostics();
  const siteConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL);
  return [
    { group: "Content", label: "Client content loaded", status: "Ready" },
    { group: "Content", label: "Final client photos", status: "Pending integration", detail: "Temporary images are still in use" },
    { group: "SEO", label: "Production domain", status: siteConfigured ? "Ready" : "Missing configuration" },
    { group: "SEO", label: "Canonical URL", status: "Ready", detail: "https://theagamyoga.com" },
    { group: "SEO", label: "Sitemap", status: "Ready", detail: "/sitemap.xml" },
    { group: "SEO", label: "Robots", status: "Ready", detail: "/robots.txt" },
    { group: "Google Calendar", label: "Calendar ID", status: calendarConfig.calendarIdConfigured ? "Ready" : "Missing configuration" },
    { group: "Google Calendar", label: "Service account email", status: calendarConfig.serviceAccountEmailConfigured ? "Ready" : "Missing configuration" },
    { group: "Google Calendar", label: "Service account private key", status: calendarConfig.serviceAccountPrivateKeyConfigured ? "Ready" : "Missing configuration" },
    { group: "Google Calendar", label: "API request", status: !calendar.configured ? "Missing configuration" : calendar.requestSucceeded ? "Ready" : "Error", detail: calendar.requestSucceeded ? `${calendar.events.length} upcoming event${calendar.events.length === 1 ? "" : "s"}` : undefined },
    { group: "Google Calendar", label: "Last successful fetch", status: calendar.lastSuccessfulFetchAt ? "Ready" : "Pending integration", detail: calendar.lastSuccessfulFetchAt || "No successful fetch recorded" },
    { group: "Google Calendar", label: "Revalidation interval", status: "Ready", detail: `${CALENDAR_REVALIDATE_SECONDS} seconds · request-driven data cache; no page ISR` },
    { group: "Google Calendar", label: "Fetched / displayed events", status: calendar.requestSucceeded ? "Ready" : "Error", detail: `${calendar.fetchedEventCount ?? 0} fetched / ${calendar.events.length} displayed` },
    { group: "Google Calendar", label: "Earliest event returned", status: "Ready", detail: calendar.events[0]?.start || "No events" },
    { group: "Google Calendar", label: "Latest event returned", status: "Ready", detail: calendar.events.at(-1)?.start || "No events" },
    { group: "Google Calendar", label: "Fetch window", status: calendar.fetchWindowStart ? "Ready" : "Missing configuration", detail: calendar.fetchWindowStart && calendar.fetchWindowEnd ? `${calendar.fetchWindowStart} → ${calendar.fetchWindowEnd}` : undefined },
    { group: "Google Calendar", label: "Latest API attempt in this process", status: lastAttempt ? lastAttempt.succeeded ? "Ready" : "Error" : "Pending integration", detail: lastAttempt ? `${lastAttempt.at} · ${lastAttempt.succeeded ? "Succeeded" : "Failed"}` : "Snapshot served from cache; no API attempt in this process" },
    { group: "Google Calendar", label: "Calendar timezone", status: calendar.calendarTimeZone ? "Ready" : "Missing configuration", detail: calendar.calendarTimeZone },
    { group: "Google Reviews", label: "Google Reviews integration", status: "Pending integration" },
    { group: "Google Reviews", label: "Place/business identifier", status: "Missing configuration" },
    { group: "Contact form", label: "Email provider", status: "Pending integration" },
    { group: "Contact form", label: "Destination email", status: "Ready", detail: "theahamyoga@gmail.com" },
    { group: "Social/contact", label: "Instagram", status: "Ready" },
    { group: "Social/contact", label: "WhatsApp number", status: "Ready" },
  ];
}
