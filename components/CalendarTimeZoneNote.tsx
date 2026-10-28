"use client";

import { useSyncExternalStore } from "react";

export function CalendarTimeZoneNote() {
  const browserReady = useSyncExternalStore(() => () => {}, () => true, () => false);
  const timeZone = browserReady ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined;
  const label = timeZone ? `Times shown in your local time · ${timeZone}` : browserReady ? "Times shown in your local time" : "Times shown in Cologne time · Europe/Berlin";

  return <p className="calendar-timezone" aria-live="polite">{label}</p>;
}
