"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { getTranslations, type Language } from "@/lib/i18n/translations";

const LanguageContext = createContext<Language>("en");
export const languageStorageKey = "theagamyoga-language";

export function LanguageProvider({ language, children }: { language: Language; children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/de") return;
    try {
      if (language === "en" && window.localStorage.getItem(languageStorageKey) === "de") {
        router.replace(`/de${window.location.search}${window.location.hash}`);
        return;
      }
      window.localStorage.setItem(languageStorageKey, language);
    } catch { /* The language route also works when storage is unavailable. */ }
  }, [language, router]);
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>;
}

export function useSiteLanguage() {
  const language = useContext(LanguageContext);
  return { language, t: getTranslations(language) };
}
