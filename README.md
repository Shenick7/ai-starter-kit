# AI Starter Kit

Beginner-friendly AI tools sorted by task, with "what it is / how to start in 5 minutes / is the free plan enough" pages, short Learn guides, a weekly newsletter, and a ₹999/month Featured slot.

Next.js (App Router) + Postgres (Neon free tier via Vercel Marketplace) + Resend.

## Pages
- `/` task buttons + top beginner picks + newsletter signup
- `/category/[slug]`, `/tools/[slug]`, `/search?q=` (zero-result searches are logged)
- `/learn`, `/learn/[slug]`
- `/submit` → `submissions` table (admin review queue)
- `/sponsor` live stats from DB + inquiry form → `sponsor_inquiries`
- `/go/[slug]` logged redirect for every outbound tool/sponsor link
- `sitemap.xml`, `robots.txt`, `opengraph-image`

## Database
Tables are created automatically on first request (`lib/db.ts`) and `entries` is seeded from `lib/tools.ts` (32 tools, each with a `sourceUrl` to the tool's own pricing page). Without `DATABASE_URL` the site still renders from the seed file, and forms return 503.

## Admin API (header `Authorization: Bearer $ADMIN_TOKEN`)
- `GET /api/admin/queue[?status=pending]`
- `POST /api/admin/approve` `{ "id": 1, "action": "approve" | "reject", "overrides": { "slug", "tagline", "what", "start": [], "free_plan", "verdict", "verdict_note", "source_url", "categories": [] } }`
- `GET /api/admin/stats`, `GET /api/admin/searches`
- `GET /api/admin/sponsors`, `POST /api/admin/sponsors` `{ "slot": "featured"|"bar"|"newsletter", "sponsor_name", "go_slug", "target_url", "headline", "week_start": "YYYY-MM-DD", "week_end": "YYYY-MM-DD", "price_inr": 999 }`

- `GET /api/admin/rows?table=pageviews|sponsor_clicks|signups|zero_result_searches|errors`
- `POST /api/admin/delete` `{ "table": "submissions", "ids": [1] }` (remove test rows; seeded tools can't be deleted)

## Newsletter
`newsletter/template.ts` renders an issue (one 5-minute trick, 5 one-line picks, "Sponsored by" line, unsubscribe placeholder). Paste into a Resend Broadcast for the "AI Starter Kit" segment. Never auto-sent.
