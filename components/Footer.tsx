"use client";

import { useSiteLanguage } from "./LanguageProvider";

import { siteContent } from "@/content/siteContent";

export function Footer() {
  const { t } = useSiteLanguage(); return <footer><div className="container footer"><a className="brand" href="#top">the<span>agam</span>yoga</a><p>{t.footer.location}</p><div><a href="#about">{t.labels.about}</a><a href="#gallery">{t.nav.gallery}</a><a href="#classes">{t.nav.classes}</a><a href="#reviews">{t.labels.feedbacks}</a><a href={siteContent.contact.instagram} target="_blank" rel="noreferrer">Instagram</a><a href="#contact">{t.nav.contact}</a></div><small>© {new Date().getFullYear()} theagamyoga. {t.footer.rights}<span className="footer__credit"> · {t.footer.credit} <a href="https://zuzanaco.com" target="_blank" rel="noopener noreferrer">zuzanaco</a></span></small></div></footer>; }
