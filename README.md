# theagamyoga

The theagamyoga Next.js site uses a dedicated Google Calendar as the source of truth for upcoming class dates. Static class offerings remain in the site content; dated events are fetched server-side with a read-only service account and rendered as native theagamyoga cards.

## Local setup

1. Create or select a dedicated Google Calendar for public class events.
2. In Google Calendar, share the calendar with the service-account email and grant it **See all event details** access.
3. In Google Cloud, enable the **Google Calendar API** for the service-account project.
4. Copy the calendar's Calendar ID from **Integrate calendar**.
5. Copy `.env.example` to `.env.local` and set:

   ```bash
   GOOGLE_CALENDAR_ID=your-calendar-id
   GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
   ```

6. Run `pnpm dev` and open [http://localhost:3000](http://localhost:3000).
7. Check [http://localhost:3000/dev](http://localhost:3000/dev) for development-only integration diagnostics.

## Vercel setup

Add the same environment variables in the Vercel project under **Settings → Environment Variables** for Preview and Production. Redeploy after changing them. All three values are server-only and must not use a `NEXT_PUBLIC_` prefix. The private key supports escaped `\\n` newlines.

## Calendar behavior

The month view uses Google Calendar's native title, start/end and location fields. Descriptions are converted to safe plain text with paragraph breaks, preserved in full, and visually clamped to six lines (five on mobile) until expanded. No event content is rewritten remotely. Legacy date/time text inside descriptions is retained rather than removed with fuzzy matching.

The query covers the previous month, current month, and six complete future months in Europe/Berlin time, including DST boundaries. Recurring events are expanded (`singleEvents: true`), ordered by `startTime`, and every API page is read (250 is the page size, not a total cap). Cancelled events are excluded. The date/time note explicitly states Cologne time; it does not incorrectly claim that server-formatted times follow the visitor's timezone.

### Refresh strategy

Previously both the event array and the static homepage had 600-second revalidation. The query also covered roughly two years but read only one page of 250 events. Older/recurring events could therefore push newly created future events off the returned page. The cached function did not include the Calendar ID in its key.

There is now one persistent server-side Calendar snapshot cache, with a **300-second** lifetime. The complete paginated snapshot, successful fetch time and count are cached together. The cache key includes the Calendar ID and current query window. The homepage renders dynamically (`revalidate = 0`), avoiding a second page/ISR cache on top of the Calendar data. The Google SDK has no application event cache configured; credentials and API requests remain server-only.

Next.js time-based revalidation is request-driven, not a scheduled Google sync: the first request after expiry can receive the previous snapshot while a refresh runs in the background. Subsequent requests receive the fresh result. A visible, open page also refreshes server props every five minutes (and when returning to the tab), without reloading the page or calling Google from the browser. Active enquiries are left undisturbed. With successful API requests, changes should normally appear within about 5–10 minutes of active traffic; a tab left open does not stay permanently frozen. Failed background refreshes may retain the last good cached snapshot until Google is reachable again.

`/dev` remains development-only and shows successful fetch time, refresh interval, event counts, first/last event timestamps, query window and the latest API attempt in the current process. It never displays credentials, event descriptions or raw API errors.

### Local verification

Check edits, additions and cancellations against the same complete snapshot fetch. Use mocked API fixtures for repeatable lifecycle, pagination, recurrence and failure tests without changing a client's live calendar. For a real Calendar edit/create/delete check, use a dedicated test calendar with permission to write; this application deliberately requests read-only access. Production ISR/data-cache behavior should be checked with `pnpm build && pnpm start`, not inferred from `next dev`.

## Public languages

English is served at `/` and German at `/de`. Both routes use `components/HomePage.tsx` and shared components, with static copy in `lib/i18n/translations.ts`. English references the approved source content in `content/siteContent.ts`; keep that copy unchanged when editing translations. There are no translation APIs or new dependencies.

The compact header language links save `theagamyoga-language` in localStorage. A saved German preference returns root visitors to `/de`; explicit EN selection resets that preference. Routes still render the correct language without storage or JavaScript. Separate lightweight root layouts share `SiteDocument`, setting the server-rendered HTML language and localized metadata. Each route has its own canonical and reciprocal EN/DE hreflang links, plus English as `x-default`.

Only website text and generated dates are localized. Calendar titles, descriptions and locations, testimonials, Tamil, names and contact details stay as supplied. Enquiry labels and status messages are translated; subjects and full offering names retain their English email values. The payload also includes `interface_language`. Legal labels are prepared, but no legal pages or business details have been invented.

Original remains the only public theme; Water and the theme preview stay preserved for development. Run `npm run test:i18n` alongside the Calendar tests, lint, TypeScript and production build when changing localization.

## Later integrations

Google Reviews and the contact form remain separate follow-up integrations. The current site displays supplied testimonials and direct contact links without adding a custom review database, event database, or CMS.
