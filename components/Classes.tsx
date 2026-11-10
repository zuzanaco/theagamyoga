import { getTranslations, type Language } from "@/lib/i18n/translations";
import { CalendarRefresh } from "./CalendarRefresh";
import { SectionRings } from "./SectionRings";
import { MonthCalendar } from "./MonthCalendar";
import { SectionHeading } from "./SectionHeading";
import { getUpcomingCalendarEvents } from "@/lib/calendar";

export async function Classes({ language = "en" }: { language?: Language }) {
  const t = getTranslations(language);
  const calendar = await getUpcomingCalendarEvents();
  return <section className="classes" id="classes"><CalendarRefresh /><svg className="classes__wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C180 5 330 5 500 48 S800 94 990 54 S1280 8 1440 32 V100 H0 Z" /></svg><SectionRings variant="classes" /><div className="container"><SectionHeading eyebrow={t.calendar.eyebrow} title={t.calendar.title} /><div className="classes__layout"><MonthCalendar events={calendar.events} initialMonthKey={calendar.currentMonthKey} calendarTimeZone={calendar.calendarTimeZone} /></div></div></section>;
}
