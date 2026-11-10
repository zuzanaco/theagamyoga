import "@/app/globals.css";
import type { Language } from "@/lib/i18n/translations";
import { LanguageProvider } from "./LanguageProvider";

export function SiteDocument({ language, children }: { language: Language; children: React.ReactNode }) {
  return <html lang={language} data-palette="original"><body><LanguageProvider language={language}>{children}</LanguageProvider></body></html>;
}
