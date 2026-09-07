# theagamyoga

The theagamyoga Next.js site uses a dedicated public Google Calendar as the source of truth for upcoming class dates. Static class offerings remain in the site content; dated events are fetched server-side and rendered as native theagamyoga cards.

## Local setup

1. Create or select a dedicated Google Calendar for public class events.
2. In Google Calendar, open **Settings and sharing**, make the calendar available publicly, and choose the visibility that allows event details to be read.
3. In Google Cloud, enable the **Google Calendar API** for a project.
4. Create an API key, restrict it to the Google Calendar API, and copy the calendar's Calendar ID from **Integrate calendar**.
5. Copy `.env.example` to `.env.local` and set:

   ```bash
   GOOGLE_CALENDAR_ID=your-calendar-id
   GOOGLE_CALENDAR_API_KEY=your-server-side-api-key
   GOOGLE_CALENDAR_TIMEZONE=Europe/Berlin
   NEXT_PUBLIC_SITE_URL=https://theagamyoga.com
   ```

6. Run `pnpm dev` and open [http://localhost:3000](http://localhost:3000).
7. Check [http://localhost:3000/dev](http://localhost:3000/dev) for development-only integration diagnostics.

## Vercel setup

Add the same environment variables in the Vercel project under **Settings → Environment Variables** for Preview and Production. Redeploy after changing them. Keep the API key in server-only `GOOGLE_CALENDAR_API_KEY`; it is intentionally not prefixed with `NEXT_PUBLIC_`.

## Calendar behavior

The site requests future events with recurring events expanded, sorts them by start time, and displays up to eight events. Events without a location or description simply omit those details. If the calendar is empty, unavailable, or not configured, the public site shows a calm empty state without exposing technical details.

## Later integrations

Google Reviews and the contact form remain separate follow-up integrations. The current site displays supplied testimonials and direct contact links without adding a custom review database, event database, or CMS.
