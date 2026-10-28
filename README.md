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

The site requests future events with recurring events expanded, sorts them by start time, and displays up to twelve events in the Europe/Berlin timezone. Successful results are revalidated every ten minutes. Events without a location or description simply omit those details. If the calendar is empty, unavailable, or not configured, the public site shows a calm empty state without exposing technical details.

## Later integrations

Google Reviews and the contact form remain separate follow-up integrations. The current site displays supplied testimonials and direct contact links without adding a custom review database, event database, or CMS.
