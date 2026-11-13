# AI Starter Kit

Beginner-friendly AI tools sorted by task, with "what it is / how to start in 5 minutes / is the free plan enough" pages, short Learn guides, a weekly newsletter, tool comparison pages, and three sponsor slots: Featured $29/month (about ₹2,700), site-wide bar $15/month (about ₹1,400), newsletter $9/month (about ₹850).

Next.js (App Router) + Postgres (Neon free tier via Vercel Marketplace) + Resend.

## Pages
- `/` task buttons + top beginner picks + newsletter signup
- `/category/[slug]`, `/tools/[slug]`, `/search?q=` (zero-result searches are logged)
- `/compare`, `/compare/[slug]` (side-by-side tool comparisons; add one in `lib/compare.ts`)
- `/learn`, `/learn/[slug]`
- `/submit` → `submissions` table (admin review queue)
- `/sponsor` live stats from DB + inquiry form → `sponsor_inquiries`
- `/contact` message form → `messages`, emailed to the owner via Resend
- `/go/[slug]` logged redirect for every outbound tool/sponsor link
- `sitemap.xml`, `robots.txt`, `opengraph-image`

## Database
Tables are created automatically on first request (`lib/db.ts`) and `entries` is seeded from `lib/tools.ts` (32 tools, each with a `sourceUrl` to the tool's own pricing page). Without `DATABASE_URL` the site still renders from the seed file, and forms return 503.

## Admin API (header `Authorization: Bearer $ADMIN_TOKEN`)
- `GET /api/admin/queue[?status=pending]`
- `POST /api/admin/approve` `{ "id": 1, "action": "approve" | "reject", "overrides": { "slug", "tagline", "what", "start": [], "free_plan", "verdict", "verdict_note", "source_url", "categories": [] } }`
- `GET /api/admin/stats`, `GET /api/admin/searches`
- `GET /api/admin/sponsors`, `POST /api/admin/sponsors` `{ "slot": "featured"|"bar"|"newsletter", "sponsor_name", "go_slug", "target_url", "headline", "week_start": "YYYY-MM-DD", "week_end": "YYYY-MM-DD", "price_inr": 2700 }`

- `GET /api/admin/rows?table=pageviews|sponsor_clicks|signups|zero_result_searches|errors`
- `POST /api/admin/delete` `{ "table": "submissions", "ids": [1] }` (remove test rows; seeded tools can't be deleted)

## Newsletter
`newsletter/template.ts` renders an issue (one 5-minute trick, 5 one-line picks, "Sponsored by" line, unsubscribe placeholder). Issues live in `newsletter/issues.ts`; the cron always sends the latest one — add a new issue there to send it next week.

- **Automatic (weekly):** Vercel Cron calls `GET /api/cron/newsletter` every Monday at 03:30 UTC (09:00 IST, see `vercel.json`). The route checks `Authorization: Bearer $CRON_SECRET`, renders the latest issue (with the active newsletter sponsor, if any), and sends it as a Resend Broadcast to the audience. Each issue number is sent only once (recorded in `newsletter_sends`).
- **Manual:** render an issue with `npx tsx scripts/render-issue.ts` and paste the HTML into a Resend Broadcast for the "AI Starter Kit" segment. Still works, unchanged.

## Environment variables (set in Vercel → Project Settings → Environment Variables)
- `DATABASE_URL` or `POSTGRES_URL`, `ADMIN_TOKEN`, `RESEND_API_KEY`, `RESEND_SEGMENT_ID` — as before.
- `CRON_SECRET` — long random string. Required for the weekly newsletter: Vercel Cron sends it as the Bearer token. **Until it is set, the cron route returns 503 and nothing is sent.**
- `RESEND_AUDIENCE_ID` — the Resend audience that holds the "AI Starter Kit" segment (Resend → Audiences). Required for the automated send; without it the cron route returns 503. The manual Broadcast path does not need it.
- `NEWSLETTER_FROM` — optional sender for the automated newsletter (defaults to `NOTIFY_FROM`, then `AI Starter Kit <onboarding@resend.dev>`).
- `TURNSTILE_SITE_KEY` (public) and `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile keys (free, from dash.cloudflare.com → Turnstile). They switch on the human check on the submit and newsletter signup forms. **Until they are set, both forms work exactly as before** (honeypot + rate limit only); the server skips verification and no widget is shown.
- `IP_HASH_SALT` — long random string for IP-hash salt (see `lib/util.ts`).

## Sponsor slots
Prices live in `lib/prices.ts` (single source of truth, shown on `/sponsor` and in the inquiry form): Featured $29/month (about ₹2,700), site-wide bar $15/month (about ₹1,400 — half the featured price), newsletter $9/month (about ₹850 — low opening price while the list is small). The admin sponsors API defaults `price_inr` per slot when none is given.
