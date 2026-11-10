"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { languageStorageKey, useSiteLanguage } from "./LanguageProvider";
import type { Language } from "@/lib/i18n/translations";

export function LanguageSwitch() {
  const router = useRouter();
  const { language, t } = useSiteLanguage();
  function remember(event: React.MouseEvent<HTMLAnchorElement>, next: Language) {
    try { window.localStorage.setItem(languageStorageKey, next); } catch { /* Optional preference. */ }
    if (window.location.hash && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      router.push(`${next === "en" ? "/" : "/de"}${window.location.hash}`);
    }
  }
  return <div className="language-switch" role="group" aria-label={t.nav.language}>
    <Link href="/" hrefLang="en" lang="en" aria-label={t.nav.english} aria-current={language === "en" ? "page" : undefined} onClick={event => remember(event, "en")}>EN</Link>
    <span aria-hidden="true">|</span>
    <Link href="/de" hrefLang="de" lang="de" aria-label={t.nav.german} aria-current={language === "de" ? "page" : undefined} onClick={event => remember(event, "de")}>DE</Link>
  </div>;
}
