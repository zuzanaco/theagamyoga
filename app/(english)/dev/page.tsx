import { notFound } from "next/navigation";
import { buildDiagnostics } from "@/lib/diagnostics";
import { getUpcomingCalendarEvents } from "@/lib/calendar";

export default async function DevelopmentStatusPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const calendar = await getUpcomingCalendarEvents();
  const diagnostics = buildDiagnostics(calendar);
  const groups = [...new Set(diagnostics.map((item) => item.group))];
  return <main className="dev-status"><div className="dev-status__inner"><p className="eyebrow">Development diagnostics</p><h1>Integration status</h1><p className="dev-status__intro">Configuration visibility for local development only. Secrets and credential values are never displayed.</p>{groups.map((group) => <section className="dev-status__group" key={group}><h2>{group}</h2><div className="dev-status__list">{diagnostics.filter((item) => item.group === group).map((item) => <div className="dev-status__row" key={`${item.group}-${item.label}`}><span>{item.label}</span><span className={`dev-status__badge dev-status__badge--${item.status.toLowerCase().replace(/\s+/g, "-")}`}>{item.status}</span>{item.detail ? <small>{item.detail}</small> : null}</div>)}</div></section>)}</div></main>;
}
