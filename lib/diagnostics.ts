import { getCalendarConfigStatus, type CalendarResult } from "./calendar";

export type DiagnosticStatus = "Ready" | "Missing configuration" | "Pending integration" | "Error";
export type Diagnostic = { group: string; label: string; status: DiagnosticStatus; detail?: string };

export function buildDiagnostics(calendar: CalendarResult): Diagnostic[] {
  const calendarConfig = getCalendarConfigStatus();
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
    { group: "Google Calendar", label: "Calendar timezone", status: calendar.calendarTimeZone ? "Ready" : "Missing configuration", detail: calendar.calendarTimeZone },
    { group: "Google Reviews", label: "Google Reviews integration", status: "Pending integration" },
    { group: "Google Reviews", label: "Place/business identifier", status: "Missing configuration" },
    { group: "Contact form", label: "Email provider", status: "Pending integration" },
    { group: "Contact form", label: "Destination email", status: "Ready", detail: "theahamyoga@gmail.com" },
    { group: "Social/contact", label: "Instagram", status: "Ready" },
    { group: "Social/contact", label: "WhatsApp number", status: "Ready" },
  ];
}
