"use client";

import { useSiteLanguage } from "./LanguageProvider";

import { SectionRings } from "./SectionRings";
import { siteContent } from "@/content/siteContent";
import { SectionHeading } from "./SectionHeading";
import { WaterNavWave } from "./WaterDividers";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const { t } = useSiteLanguage(); return <section className="contact" id="contact"><WaterNavWave flipped /><SectionRings variant="contact" /><div className="container contact__grid"><div className="contact__intro"><SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} /><p>{t.contact.body}</p><span className="contact__accent" aria-hidden="true" /><ContactForm /></div><div className="contact__details"><span className="contact__location">{t.contact.location}</span><div className="contact__actions"><a className="contact__action" href={`mailto:${siteContent.contact.email}`} target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg><span>{siteContent.contact.email}</span></a><a className="contact__action" href={`https://wa.me/${siteContent.contact.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1.5 1.5 0 0 1 1.53-.36l2.54.85a1.6 1.6 0 0 1 1.02 1.42v2.31A1.6 1.6 0 0 1 18.9 21C10.06 21 3 13.94 3 5.1A1.6 1.6 0 0 1 4.6 3.5h2.31a1.5 1.5 0 0 1 1.42 1.02l.85 2.54a1.5 1.5 0 0 1-.36 1.53l-2.2 2.2Z" /></svg><span>{siteContent.contact.phone}</span></a><a className="contact__instagram" href={siteContent.contact.instagram} target="_blank" rel="noreferrer" aria-label={t.contact.instagram}><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a></div></div></div></section>; }
