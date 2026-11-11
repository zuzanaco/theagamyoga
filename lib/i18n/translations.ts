import { siteContent } from "@/content/siteContent";
import { calendarLabels } from "@/content/calendarContent";

export type Language = "en" | "de";

const en = {
  "labels": siteContent.labels,
  "nav": {
    "main": "Main navigation",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "reviews": "Reviews",
    "home": "theagamyoga home",
    "menu": "Toggle menu",
    "gallery": "Gallery",
    "agam": "Agam",
    "offerings": "Offerings",
    "classes": "Classes",
    "contact": "Contact",
    "language": "Language",
    "english": "English",
    "german": "Deutsch"
  },
  "hero": {
    "first": "Yoga is the practice",
    "before": "of turning ",
    "emphasis": "inward",
    "after": ".",
    "classes": "View classes",
    "photo": "Yoga practice by the sea",
    "rings": [
      "Go to Essence — Meiporul",
      "Go to Breath — Moochu",
      "Go to Stillness — Mounam"
    ]
  },
  "about": {
    "photo": "Yoga practice in a garden",
    "story": [
      "My yoga journey began at age 8 in an ashram, and the practice has remained part of my life ever since.",
      "My foundation comes from traditional yoga, with influences from the Sivananda and Bihar School of Yoga traditions, complemented by my formal Hatha and Prenatal Yoga teacher training.",
      "Over the years in India, I worked with around 100 individual clients across different age groups as a solo yoga instructor and personal trainer, alongside corporate, group, and kids' sessions.",
      "Today, my teaching reaches beyond India, with clients across India, the USA, Singapore, and Canada.",
      "Now, a new chapter begins in Germany.",
      "I bring with me a practice shaped by tradition, refined through years of teaching, and adapted to the individual in front of me.",
      "Rooted in tradition. Personal in practice. Open to the world."
    ],
    "experience": "Experience highlights",
    "stats": [
      "Hatha Yoga Teacher",
      "Prenatal Yoga Teacher",
      "teaching hours",
      "clients",
      "regular clients"
    ],
    "teaching": "Teaching across",
    "groups": [
      "One-to-one",
      "Groups & families",
      "Corporate",
      "Children",
      "Older adults",
      "Prenatal",
      "Beginners",
      "Adapted practice",
      "Meditation & Yoga Nidra"
    ],
    "hathaLead": "Hatha Yoga is where we begin — and where we stay.",
    "hathaBody": " As a student's practice develops, sessions may move into a Hatha–Vinyasa rhythm, combining the stability and alignment of Hatha with more breath-led movement.",
    "special": "What makes the journey special?",
    "specialBody": "Some clients have stayed with me for more than two years — and continue their practice with me today. Because for me, yoga isn't about completing a class. It's about building a practice you can stay with.",
    "chapter": "Now, with my move to Germany, I bring this experience into a new chapter.",
    "signature": "AGAM Yoga — அகம் — Within."
  },
  "philosophyTitle": "Three ideas behind every class I teach",
  "principles": siteContent.principles,
  "offerings": siteContent.offerings,
  "offeringUi": {
    "eyebrow": "Current offerings",
    "title": "Build a practice from within.",
    "carousel": "Current yoga offerings",
    "previous": "Previous offering",
    "next": "Next offering",
    "enquire": "Enquire"
  },
  "gallery": {
    "label": "Practice images",
    "carousel": "Yoga practice gallery",
    "previous": "Scroll to previous gallery images",
    "next": "Scroll to next gallery images",
    "alts": [
      "Standing dancer pose in a bright yoga studio",
      "Headstand practice on grass by the sea",
      "Side plank practice on the beach",
      "Wheel pose in a sunlit yoga studio",
      "Group yoga class in a bright studio",
      "Seated backbend practice in a yoga studio",
      "Students practising seated yoga with raised arms"
    ]
  },
  "reviews": {
    "title": "Words from the practice.",
    "carousel": "Client reviews",
    "previous": "Previous review",
    "next": "Next review",
    "scroll": "Reviews — scroll to read more",
    "stars": "Five stars",
    "open": "Open review ↗",
    "openFrom": "Open full review from",
    "close": "Close review",
    "note": "A selection of client words shared with permission."
  },
  "contact": {
    "eyebrow": "Practise together",
    "title": "You’re warmly invited.",
    "body": "For class details, private sessions, or collaborations, reach out via the contact form or contact details below.",
    "location": "Cologne, Germany",
    "instagram": "Instagram — @theagam.yoga"
  },
  "footer": {
    "location": "Anitha Ramalingam · Cologne, Germany",
    "rights": "All rights reserved.",
    "credit": "made by",
    "imprint": "Imprint",
    "privacy": "Privacy Policy"
  },
  "calendar": {
    ...calendarLabels,
    "eyebrow": "Upcoming class dates",
    "title": "A little time, held for you.",
    "previous": "Previous month",
    "next": "Next month",
    "today": "Today",
    "grid": "class calendar",
    "noClasses": "no classes",
    "classSingular": "class",
    "classPlural": "classes",
    "more": "more",
    "empty": "No classes are scheduled for this day.",
    "dayClasses": "Classes on this day",
    "weekdays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  "form": {
    "open": "Send an enquiry",
    "close": "Close enquiry form",
    "question": "What would you like to enquire about?",
    "specific": "Specific date",
    "general": "General enquiry",
    "offerings": {
      "beginner-workshop": "Beginner Workshop",
      "hatha-vinyasa": "Hatha–Vinyasa",
      "yoga-nidra": "Yoga Nidra",
      "one-to-one": "1-to-1 Classes"
    },
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "message": "Message",
    "optional": "(optional)",
    "submit": "Send enquiry",
    "sending": "Sending…",
    "success": "Thank you — your enquiry has been sent.",
    "validation": "Please enter your name and a valid email address.",
    "failure": "Your enquiry couldn’t be sent. Please try again."
  }
};

type Localized<T> = T extends string ? string : T extends readonly (infer Item)[] ? readonly Localized<Item>[] : { [Key in keyof T]: Localized<T[Key]> };
export type Dictionary = Localized<typeof en>;

const de: Dictionary = {
  labels: { about: "Über mich", meetAnitha: "Anitha kennenlernen", feedbacks: "Rückmeldungen", style: "AGAM Yoga — அகம் — Im Inneren." },
  nav: { main: "Hauptnavigation", openMenu: "Menü öffnen", closeMenu: "Menü schließen", reviews: "Rückmeldungen", home: "theagamyoga Startseite", menu: "Menü öffnen oder schließen", gallery: "Galerie", agam: "Agam", offerings: "Angebote", classes: "Kurse", contact: "Kontakt", language: "Sprache", english: "English", german: "Deutsch" },
  hero: { first: "Yoga ist die Praxis,", before: "sich nach ", emphasis: "innen zu wenden", after: ".", classes: "Kurse ansehen", photo: "Yogapraxis am Meer", rings: ["Zur Essenz — Meiporul", "Zum Atem — Moochu", "Zur Stille — Mounam"] },
  about: {
    photo: "Yogapraxis in einem Garten",
    story: [
      "Meine Yogareise begann im Alter von 8 Jahren in einem Ashram. Seitdem ist Yoga ein fester Bestandteil meines Lebens.",
      "Meine Grundlage ist traditionelles Yoga, geprägt von der Sivananda- und der Bihar-School-of-Yoga-Tradition und ergänzt durch meine Ausbildungen zur Hatha-Yoga- und Pränatal-Yoga-Lehrerin.",
      "Über die Jahre habe ich in Indien als selbstständige Yogalehrerin und Personal Trainerin mit rund 100 Einzelkundinnen und -kunden verschiedener Altersgruppen gearbeitet. Dazu kamen Yogaeinheiten für Unternehmen, Gruppen und Kinder.",
      "Heute unterrichte ich über Indien hinaus Menschen in Indien, den USA, Singapur und Kanada.",
      "Nun beginnt ein neues Kapitel in Deutschland.",
      "Ich bringe eine Praxis mit, die von Tradition geprägt, durch jahrelanges Unterrichten verfeinert und auf den Menschen vor mir abgestimmt ist.",
      "In der Tradition verwurzelt. Persönlich in der Praxis. Offen für die Welt."
    ],
    experience: "Erfahrung im Überblick", stats: ["Hatha-Yoga-Lehrerin", "Pränatal-Yoga-Lehrerin", "Unterrichtsstunden", "Kundinnen und Kunden", "regelmäßige Teilnehmende"], teaching: "Unterricht für", groups: ["Einzelunterricht", "Gruppen & Familien", "Unternehmen", "Kinder", "Ältere Menschen", "Schwangere", "Anfänger", "Angepasste Praxis", "Meditation & Yoga Nidra"],
    hathaLead: "Mit Hatha Yoga beginnen wir — und dabei bleiben wir.",
    hathaBody: " Wenn sich die Praxis weiterentwickelt, können die Einheiten in einen Hatha–Vinyasa-Rhythmus übergehen, der die Stabilität und Ausrichtung des Hatha Yoga mit mehr atemgeführter Bewegung verbindet.",
    special: "Was macht diesen Weg besonders?",
    specialBody: "Einige Menschen praktizieren seit mehr als zwei Jahren mit mir — und setzen ihre Praxis bis heute fort. Denn für mich geht es beim Yoga nicht darum, eine Stunde abzuschließen. Es geht darum, eine Praxis aufzubauen, bei der man bleiben kann.",
    chapter: "Mit meinem Umzug nach Deutschland nehme ich diese Erfahrung nun in ein neues Kapitel mit.",
    signature: "AGAM Yoga — அகம் — Im Inneren."
  },
  philosophyTitle: "Drei Gedanken hinter jeder Stunde, die ich unterrichte",
  principles: [
    ["மௌனம்", "Mounam — Stille", "Ich beginne und beende jede Stunde in wirklicher Stille. Nicht als Formalität — ich gebe dir einige volle Minuten, um im Körper anzukommen, bevor die Bewegung beginnt."],
    ["மூச்சு", "Moochu — Atem", "Bei mir führt der Atem jede Bewegung, nie umgekehrt. Wenn dein Atem kurz wird, sage ich dir, dass die Haltung zu weit geht — das ist die einzige Regel, an der ich festhalte."],
    ["மெய்ப்பொருள்", "Meiporul — Essenz", "Meine Hinweise zur Ausrichtung orientieren sich daran, was an diesem Tag für deinen Körper stimmig ist, nicht an einer Form aus dem Lehrbuch. Ich biete selbstverständlich Varianten an — du musst dich nie dafür entschuldigen, sie zu nutzen."]
  ],
  offerings: [
    { id: "beginner-workshop", number: "01", title: "Yoga-Workshop für Anfänger: 10 Einheiten", tagline: "Mit den Grundlagen beginnen. Die eigene Praxis aufbauen.", text: "Ein strukturierter Workshop mit 10 Einheiten für Menschen, die neu mit Yoga beginnen oder ihre Grundlagen neu aufbauen möchten. Er führt in grundlegende Hatha-Yoga-Haltungen, Ausrichtung, Körper- und Atemwahrnehmung, grundlegende Bewegungsmuster, Kraft und Beweglichkeit, die Grundlagen des Sonnengrußes, einfache Hatha–Vinyasa-Flows, Entspannung, achtsames Üben und Yoga Nidra ein.", note: "Keine Yoga-Vorkenntnisse erforderlich." },
    { id: "hatha-vinyasa", number: "02", title: "Hatha–Vinyasa Yoga", tagline: "Grundlagen treffen auf Flow.", text: "Sobald die Grundlagen gefestigt sind, verbindet Hatha–Vinyasa die Stabilität, Ausrichtung und Achtsamkeit des Hatha Yoga mit Bewegung, Atem und Flow des Vinyasa.", note: "Die Einheiten lassen sich an Erfahrung, persönliche Ziele und verfügbare Zeit anpassen." },
    { id: "yoga-nidra", number: "03", title: "Yoga Nidra", tagline: "Nach innen wenden. Zur Ruhe kommen.", text: "Eine geführte Entspannungs- und Meditationspraxis als Teil des AGAM Yoga-Ansatzes — ein ruhiger Raum, um innezuhalten, bewusst wahrzunehmen und sich nach innen zu wenden.", note: "Von der Bewegung zur Stille. Von außen nach innen." },
    { id: "one-to-one", number: "04", title: "1:1-Einzelunterricht", tagline: "Online oder vor Ort.", text: "Online oder vor Ort möglich.", note: "" }
  ],
  offeringUi: { eyebrow: "Aktuelle Angebote", title: "Eine Praxis von innen heraus aufbauen.", carousel: "Aktuelle Yogaangebote", previous: "Vorheriges Angebot", next: "Nächstes Angebot", enquire: "Anfragen" },
  gallery: { label: "Bilder aus der Praxis", carousel: "Galerie der Yogapraxis", previous: "Zu den vorherigen Galeriebildern", next: "Zu den nächsten Galeriebildern", alts: ["Stehende Tänzerhaltung in einem hellen Yogastudio", "Kopfstand auf einer Wiese am Meer", "Seitstütz am Strand", "Rad-Haltung in einem sonnigen Yogastudio", "Yogastunde in einer Gruppe in einem hellen Studio", "Rückbeuge im Sitzen in einem Yogastudio", "Teilnehmende üben Yoga im Sitzen mit erhobenen Armen"] },
  reviews: { title: "Stimmen aus der Praxis.", carousel: "Rückmeldungen von Teilnehmenden", previous: "Vorherige Rückmeldung", next: "Nächste Rückmeldung", scroll: "Rückmeldungen — für weitere scrollen", stars: "Fünf Sterne", open: "Rückmeldung öffnen ↗", openFrom: "Vollständige Rückmeldung öffnen von", close: "Rückmeldung schließen", note: "Eine Auswahl von Rückmeldungen, mit Erlaubnis geteilt." },
  contact: { eyebrow: "Gemeinsam praktizieren", title: "Du bist herzlich eingeladen.", body: "Für Kursinformationen, Einzelstunden oder eine Zusammenarbeit nutze das Kontaktformular oder die Kontaktdaten unten.", location: "Köln, Deutschland", instagram: "Instagram — @theagam.yoga" },
  footer: { location: "Anitha Ramalingam · Köln, Deutschland", rights: "Alle Rechte vorbehalten.", credit: "erstellt von", imprint: "Impressum", privacy: "Datenschutz" },
  calendar: { selectedEvent: "Ausgewählter Kurs", selectedDate: "Ausgewähltes Datum", chooseDay: "Wähle einen Tag", date: "Datum", time: "Uhrzeit", location: "Ort", allDay: "Ganztägig", defaultTitle: "Yogastunde", readMore: "Weiterlesen", showLess: "Weniger anzeigen", enquire: "Anfragen / Diesen Kurs buchen", viewOffering: "Angebot ansehen", timeZoneNote: "Zeiten in Kölner Ortszeit · Europe/Berlin", eyebrow: "Kommende Kurstermine", title: "Ein wenig Zeit, ganz für dich.", previous: "Vorheriger Monat", next: "Nächster Monat", today: "Heute", grid: "Kurskalender", noClasses: "keine Kurse", classSingular: "Kurs", classPlural: "Kurse", more: "weitere", empty: "Für diesen Tag sind keine Kurse geplant.", dayClasses: "Kurse an diesem Tag", weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] },
  form: { open: "Eine Anfrage senden", close: "Anfrageformular schließen", question: "Wozu möchtest du eine Anfrage stellen?", specific: "Bestimmter Termin", general: "Allgemeine Anfrage", offerings: { "beginner-workshop": "Anfänger-Workshop", "hatha-vinyasa": "Hatha–Vinyasa", "yoga-nidra": "Yoga Nidra", "one-to-one": "1:1-Kurse" }, name: "Name", email: "E-Mail", phone: "Telefon", message: "Nachricht", optional: "(optional)", submit: "Anfrage senden", sending: "Wird gesendet…", success: "Vielen Dank — deine Anfrage wurde gesendet.", validation: "Bitte gib deinen Namen und eine gültige E-Mail-Adresse ein.", failure: "Deine Anfrage konnte nicht gesendet werden. Bitte versuche es erneut." }
};

export const translations: Record<Language, Dictionary> = { en, de };
export const getTranslations = (language: Language) => translations[language];
export const dateLocale = (language: Language) => language === "de" ? "de-DE" : "en-GB";
