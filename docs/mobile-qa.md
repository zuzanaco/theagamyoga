# Mobile layout and QA

Local implementation, 10 November 2026. No push or deployment.

## Implementation

- Shared layout variables: 16–20px gutters, 72px section spacing, 24px content gaps and a 64px header plus safe-area inset.
- Breakpoints: 1023px for touch-friendly shared styles and drawer navigation, 700–1023px for the tablet composition, below 700px for single-item phone carousels and a single-column form, 360px for a two-row calendar toolbar.
- Desktop presentation is retained. Desktop month cells keep agenda previews; mobile/tablet cells use a dot and exact count, with all seven columns visible without horizontal calendar scrolling.
- Header: logo and 44px menu trigger. Full-height scrollable drawer includes every section, Reviews and EN/DE. Escape, close, section navigation, focus containment, background inertness, scroll lock and resize cleanup are supported.
- Hero: fluid headline, stacked CTAs and a centered, bounded circle composition. Outer → Essence, middle → Breath, inner → Stillness; tap navigation and temporary target highlight remain intact.
- About: square image framing, stacked story, credentials, journey and callouts. Principle cards stack with responsive Tamil headings.
- Gallery: one dominant image and a next-image peek on phones; tablet shows more. Native horizontal browsing and infinite loop remain. Uniform cropped frames use `object-fit: cover`: 4:5 / 84vw on phones and 3:4 / 42vw on tablets. Side-plank and group-class photos have image-specific crop positioning; image files are unchanged. See `gallery-responsive-qa.md` for the follow-up breakpoint audit. Gallery URLs are encoded before passing them to Next Image: the production optimizer rejected unescaped spaces/commas in the original filenames even though development rendering succeeded.
- Offerings: approximately 88% of the available phone width, about 56% on tablet. Controls have their own row above content. The viewport follows the active offering height, preserving full copy without imposing the longest offering's blank space on every slide. Stable IDs and enquiry selection are retained.
- Reviews: one readable preview plus peek on phones, eight visible quote lines, readable names and controls below the cards. Full original reviews open in the existing dialog; its scrolling body is keyboard accessible and its close control is 44px.
- Calendar: compact seven-column month grid, clear Today/selection states, localized accessible counts, timezone metadata below the grid, full-width detail panel below it. Description expansion, event-list selection and enquiry context remain intact.
- Contact and footer: vertical contact actions, wrapping long email text, 44px link targets and wrapping footer links. Existing language-aware legal labels remain prepared; legal pages/details are not fabricated.
- Enquiry: persistent non-scrolling header/close button, one scrolling body, 24px total phone side inset, safe-area-aware `dvh` height, vertical radio list and 16px input text. Phone form fields stack; tablet Name/Email may share a row. Submission destination, payload subjects, selected-class context and 1500ms success close remain unchanged.
- Decorative rings use a static, restrained mobile treatment rather than continuous animation. Desktop motion, reduced-motion support and preserved Water components/styles remain available.

## Files

`app/globals.css`; `components/Navigation.tsx`; `components/Hero.tsx`; `components/Gallery.tsx`; `components/YogaOfferings.tsx`; `components/MonthCalendar.tsx`; `components/Reviews.tsx`; `components/SectionRings.tsx`; `lib/i18n/translations.ts`; `tests/i18n.test.cjs`; this report.

The translation additions are menu open/close labels and the requested Reviews navigation label. Approved English/German paragraphs, offerings, testimonials, Tamil, names and contact details were not rewritten. Calendar fetching, caching, refresh and source event data were not changed. Original is still the only public theme; Water code remains preserved, with no public theme control.

## Breakpoint cleanup

Consolidated the old shared 720/860px dropdown, hero, gallery, offering, review, principle-card and form overrides into the responsive system. Removed duplicate phone Calendar sizing, CTA sizing, description-clamp and selected-detail rules and the tablet three-column principle-card override. Theme-specific Water rules were retained.

## Viewport matrix

Both languages were checked at every requested size. Checks cover page width, content bounds, seven-column calendar fit, one-column principles, carousel widths, loaded images, modal overflow, fixed close visibility, page lock and 16px input text.

| Viewport | English | German |
| --- | --- | --- |
| 320 × 568 | Pass | Pass |
| 360 × 800 | Pass | Pass |
| 375 × 812 | Pass | Pass |
| 390 × 844 | Pass | Pass |
| 430 × 932 | Pass | Pass |
| 768 × 1024 | Pass | Pass |

German expansion checks include navigation, heading wrapping, Tamil card fit, calendar toolbar/CTA, radio labels and modal header. The 320px contact-decoration overflow and Tamil card minimum-width issue were corrected.

## Interaction checks

- Menu opens/closes, Escape returns focus, navigation closes the drawer and releases background lock; language selection remains persistent.
- All three Original rings were clicked at phone size; each navigated to and highlighted the correct card.
- Gallery looping and primary-image/peek composition, offering navigation/adaptive height and offering-specific enquiry selection checked.
- Calendar single/multiple-day selection, Read more/Show less and Specific date enquiry checked. Deterministic fixtures exercise 0/1/2/5/10 events in EN and DE without writing to Google Calendar.
- Long review dialog scrolling, persistent close, original review language and previous/next navigation checked.
- Mocked EN/DE enquiry tests cover required-field validation, failure preservation/retry, unchanged general/offering/event email payloads, success/reset, 1500ms auto-close, stale-event cleanup, Escape, focus return and exact page scroll restoration. No test emails sent.
- Lint, TypeScript, Calendar/i18n regression tests and production build pass.
- Production image optimizer responses were checked for all seven gallery photos, including their space/comma-containing filenames.

Viewport tests use the local browser. Physical iOS/Android keyboards and browser chrome were not available for hardware testing; dynamic viewport sizing, safe-area CSS and 16px inputs are implemented for those conditions.
