import { getTranslations, type Language } from "@/lib/i18n/translations";

export function CalendarTimeZoneNote({ language = "en" }: { language?: Language }) {
  return <p className="calendar-timezone">{getTranslations(language).calendar.timeZoneNote}</p>;
}
