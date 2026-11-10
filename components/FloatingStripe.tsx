"use client";

import { useSiteLanguage } from "./LanguageProvider";

export function FloatingStripe() {
  const { t } = useSiteLanguage();
  return <div className="floating-stripe" aria-hidden="true"><p className="floating-stripe__line">{t.stripe}</p></div>;
}
