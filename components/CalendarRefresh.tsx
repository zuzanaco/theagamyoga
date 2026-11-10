"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { calendarSettings } from "@/content/calendarContent";

// Refresh server-rendered props without reloading the page or exposing credentials.
export function CalendarRefresh() {
  const router = useRouter();
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible" && !document.querySelector('[aria-modal="true"], dialog[open]')) router.refresh();
    };
    const timer = window.setInterval(refresh, calendarSettings.revalidateSeconds * 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);
  return null;
}
