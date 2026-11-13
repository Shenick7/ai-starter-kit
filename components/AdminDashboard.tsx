"use client";
import { useCallback, useEffect, useState } from "react";

// Admin dashboard. There is no server login: the owner pastes the admin
// token (ADMIN_TOKEN) once and it is kept in sessionStorage only — it is
// never saved to localStorage, never written to a cookie, and never logged.
// Closing the tab forgets it.
const TOKEN_KEY = "admin-token";

type Stats = {
  pageviews30d?: number;
  pageviewsAll?: number;
  subscribers?: number;
  tools?: number;
  sponsorClicks30d?: number;
  since?: string | null;
  pending_submissions?: number;
  sponsor_inquiries?: number;
  errors_7d?: number;
  pageviews_24h?: number;
  signups_7d?: number;
  topPages?: { path: string; views: number }[];
  topClicks?: { slug: string; clicks: number }[];
  recentErrors?: { location: string; message: string; created_at: string }[];
};

type Submission = {
  id: number;
  name: string;
  url: string;
  category: string | null;
  tagline: string | null;
  free_plan: string | null;
  submitter_email: string | null;
  created_at: string;
};

type ZeroSearch = { query: string; times: number; last_seen: string };
type Inquiry = { id: number; name: string; email: string; company: string | null; slot: string | null; message: string | null; created_at: string };
type SponsorWeek = { id: number; slot: string; sponsor_name: string; go_slug: string | null; week_start: string; week_end: string; price_inr: number; status: string; clicks?: number };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function api(token: string, path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [entered, setEntered] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"overview" | "review" | "searches" | "sponsors">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [queue, setQueue] = useState<Submission[]>([]);
  const [searches, setSearches] = useState<ZeroSearch[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [weeks, setWeeks] = useState<SponsorWeek[]>([]);
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [slugs, setSlugs] = useState<Record<number, string>>({});
  const [booking, setBooking] = useState({ slot: "featured", sponsor_name: "", go_slug: "", target_url: "", headline: "", week_start: "", week_end: "", price_inr: "2700" });
  const [bookingBusy, setBookingBusy] = useState(false);

  const loadAll = useCallback(async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const [s, q, se, sp] = await Promise.all([
        api(t, "/api/admin/stats"),
        api(t, "/api/admin/queue?status=pending"),
        api(t, "/api/admin/searches"),
        api(t, "/api/admin/sponsors"),
      ]);
      setStats(s as Stats);
      setQueue((q as { submissions: Submission[] }).submissions || []);
      setSearches((se as { zeroResultSearches: ZeroSearch[] }).zeroResultSearches || []);
      setInquiries((sp as { inquiries: Inquiry[] }).inquiries || []);
      setWeeks((sp as { sponsorWeeks: SponsorWeek[] }).sponsorWeeks || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the dashboard.");
      setReady(false);
      try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  // If the token is already in this tab's session, load straight away.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(TOKEN_KEY) || "";
      if (saved) {
        setToken(saved);
        setReady(true);
        void loadAll(saved);
      }
    } catch {}
  }, [loadAll]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const t = entered.trim();
    if (!t) return;
    setError("");
    setLoading(true);
    try {
      await api(t, "/api/admin/stats");
      try { sessionStorage.setItem(TOKEN_KEY, t); } catch {}
      setToken(t);
      setEntered("");
      setReady(true);
      await loadAll(t);
    } catch {
      setError("That token did not work. Check the admin token in Vercel and try again.");
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch {}
    setToken("");
    setReady(false);
    setStats(null);
    setQueue([]);
  }

  async function review(id: number, action: "approve" | "reject") {
    setBusyId(id);
    setNote("");
    setError("");
    try {
      const body: Record<string, unknown> = { id, action };
      if (action === "approve") body.overrides = { slug: slugs[id] || undefined };
      const res = await api(token, "/api/admin/approve", { method: "POST", body: JSON.stringify(body) });
      setNote(
        action === "approve"
          ? `Approved — the tool is now live${res.slug ? ` at /tools/${res.slug}` : ""}.`
          : "Rejected — the suggestion has been marked as rejected.",
      );
      await loadAll(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not work. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function bookSponsor(e: React.FormEvent) {
    e.preventDefault();
    setBookingBusy(true);
    setNote("");
    setError("");
    try {
      await api(token, "/api/admin/sponsors", {
        method: "POST",
        body: JSON.stringify({ ...booking, price_inr: Number(booking.price_inr) || 2700 }),
      });
      setNote(`Sponsor week booked for ${booking.sponsor_name}.`);
      setBooking({ slot: "featured", sponsor_name: "", go_slug: "", target_url: "", headline: "", week_start: "", week_end: "", price_inr: "2700" });
      await loadAll(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book the sponsor week.");
    } finally {
      setBookingBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="prose">
        <h1>Admin dashboard</h1>
        <p className="muted">For the site owner only. Sign in with the admin token to review tool suggestions, see stats and sponsor enquiries.</p>
        <form className="f" onSubmit={signIn}>
          <label>
            Admin token
            <input
              type="password"
              value={entered}
              onChange={(e) => setEntered(e.target.value)}
              placeholder="Paste the admin token from Vercel"
              autoComplete="off"
            />
          </label>
          <p className="muted" style={{ fontSize: 14, margin: 0 }}>
            The token is kept in this tab only and forgotten when you close it. It is never saved on the site.
          </p>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
        {error && <p className="note err">{error}</p>}
        <p className="muted" style={{ fontSize: 14 }}>
          The token is the ADMIN_TOKEN value in Vercel → Project Settings → Environment Variables.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginTop: 18 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Admin dashboard</h1>
        <button className="btn ghost" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
      <p className="muted">Everything below comes from the site&apos;s own database — nothing here is public.</p>
      <div className="chips" role="tablist" aria-label="Dashboard sections">
        {(
          [
            ["overview", "Overview"],
            ["review", `Review tool suggestions${queue.length ? ` (${queue.length})` : ""}`],
            ["searches", "What people searched"],
            ["sponsors", `Sponsors${inquiries.length ? ` (${inquiries.length})` : ""}`],
          ] as const
        ).map(([key, label]) => (
          <button key={key} className={`chip${tab === key ? " on" : ""}`} onClick={() => setTab(key)} aria-pressed={tab === key}>
            {label}
          </button>
        ))}
      </div>
      {loading && <p className="muted">Loading…</p>}
      {error && <p className="note err">{error}</p>}
      {note && <p className="note ok">{note}</p>}

      {tab === "overview" && stats && (
        <div>
          <div className="stats" style={{ marginTop: 16 }}>
            <Stat label="Page views (30 days)" value={stats.pageviews30d ?? 0} />
            <Stat label="Page views (today)" value={stats.pageviews_24h ?? 0} />
            <Stat label="Newsletter subscribers" value={stats.subscribers ?? 0} />
            <Stat label="New signups (7 days)" value={stats.signups_7d ?? 0} />
            <Stat label="Tools listed" value={stats.tools ?? 0} />
            <Stat label="Clicks to tools (30 days)" value={stats.sponsorClicks30d ?? 0} />
            <Stat label="Tool suggestions waiting" value={stats.pending_submissions ?? 0} />
            <Stat label="Sponsor enquiries" value={stats.sponsor_inquiries ?? 0} />
          </div>
          <h2 className="sec">Most visited pages (30 days)</h2>
          {stats.topPages?.length ? (
            <table className="tbl">
              <thead>
                <tr><th>Page</th><th>Views</th></tr>
              </thead>
              <tbody>
                {stats.topPages.map((p) => (
                  <tr key={p.path}><td>{p.path}</td><td>{p.views}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">No page views yet in the last 30 days.</p>
          )}
          <h2 className="sec">Most clicked tools (30 days)</h2>
          {stats.topClicks?.length ? (
            <table className="tbl">
              <thead>
                <tr><th>Tool</th><th>Clicks</th></tr>
              </thead>
              <tbody>
                {stats.topClicks.map((c) => (
                  <tr key={c.slug}><td>{c.slug}</td><td>{c.clicks}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">No tool clicks yet in the last 30 days.</p>
          )}
          {stats.recentErrors?.length ? (
            <>
              <h2 className="sec">Recent errors</h2>
              <table className="tbl">
                <thead>
                  <tr><th>Where</th><th>What happened</th><th>When</th></tr>
                </thead>
                <tbody>
                  {stats.recentErrors.map((e, i) => (
                    <tr key={i}><td>{e.location}</td><td>{e.message}</td><td>{new Date(e.created_at).toLocaleDateString("en-IN")}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}
        </div>
      )}

      {tab === "review" && (
        <div>
          <h2 className="sec">Tool suggestions waiting for review</h2>
          {queue.length === 0 ? (
            <p className="muted">Nothing waiting — every suggestion has been reviewed.</p>
          ) : (
            queue.map((s) => (
              <div className="box" key={s.id}>
                <h3 style={{ margin: "0 0 4px" }}>{s.name}</h3>
                <p style={{ margin: "0 0 4px" }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
                </p>
                <p className="muted" style={{ margin: "0 0 4px", fontSize: 14 }}>
                  Category: {s.category || "not given"} · Suggested by: {s.submitter_email || "no email"} ·{" "}
                  {new Date(s.created_at).toLocaleDateString("en-IN")}
                </p>
                <p style={{ margin: "0 0 10px" }}>{s.tagline || "No description given."}</p>
                {s.free_plan && <p style={{ margin: "0 0 10px", fontSize: 14 }}>Free plan (as submitted): {s.free_plan}</p>}
                <label style={{ fontSize: 14, fontWeight: 600, display: "grid", gap: 4, maxWidth: 360 }}>
                  Web address for the new page
                  <input
                    type="text"
                    value={slugs[s.id] ?? slugify(s.name)}
                    onChange={(e) => setSlugs({ ...slugs, [s.id]: e.target.value })}
                    style={{ font: "inherit", fontSize: 15, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 10 }}
                  />
                </label>
                <div className="row" style={{ marginTop: 10 }}>
                  <button className="btn" type="button" disabled={busyId === s.id} onClick={() => void review(s.id, "approve")}>
                    {busyId === s.id ? "Working…" : "Approve & publish"}
                  </button>
                  <button className="btn ghost" type="button" disabled={busyId === s.id} onClick={() => void review(s.id, "reject")}>
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "searches" && (
        <div>
          <h2 className="sec">Searches with no results (last 90 days)</h2>
          <p className="muted">What visitors searched for and did not find. The most-searched ones are the best ideas for new tools and guides.</p>
          {searches.length === 0 ? (
            <p className="muted">No failed searches in the last 90 days.</p>
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>What they searched</th><th>Times</th><th>Last seen</th></tr>
              </thead>
              <tbody>
                {searches.map((s) => (
                  <tr key={s.query}>
                    <td>{s.query}</td>
                    <td>{s.times}</td>
                    <td>{new Date(s.last_seen).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "sponsors" && (
        <div>
          <h2 className="sec">Sponsor enquiries</h2>
          {inquiries.length === 0 ? (
            <p className="muted">No sponsor enquiries yet.</p>
          ) : (
            inquiries.map((q) => (
              <div className="box" key={q.id}>
                <h3 style={{ margin: "0 0 4px" }}>{q.name} {q.company ? `· ${q.company}` : ""}</h3>
                <p className="muted" style={{ margin: "0 0 4px", fontSize: 14 }}>
                  {q.email} · Slot: {q.slot || "not given"} · {new Date(q.created_at).toLocaleDateString("en-IN")}
                </p>
                <p style={{ margin: 0 }}>{q.message || "No message."}</p>
              </div>
            ))
          )}
          <h2 className="sec">Booked sponsor weeks</h2>
          {weeks.length === 0 ? (
            <p className="muted">No sponsor weeks booked yet.</p>
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>Slot</th><th>Sponsor</th><th>Dates</th><th>Price (₹)</th><th>Status</th><th>Clicks</th></tr>
              </thead>
              <tbody>
                {weeks.map((w) => (
                  <tr key={w.id}>
                    <td>{w.slot}</td>
                    <td>{w.sponsor_name}</td>
                    <td>{w.week_start} → {w.week_end}</td>
                    <td>{w.price_inr}</td>
                    <td>{w.status}</td>
                    <td>{w.clicks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h2 className="sec">Book a sponsor week</h2>
          <form className="f" onSubmit={bookSponsor}>
            <label>
              Slot
              <select value={booking.slot} onChange={(e) => setBooking({ ...booking, slot: e.target.value })}>
                <option value="featured">Featured (homepage card)</option>
                <option value="bar">Top bar (every page)</option>
                <option value="newsletter">Newsletter</option>
              </select>
            </label>
            <label>
              Sponsor name
              <input type="text" required value={booking.sponsor_name} onChange={(e) => setBooking({ ...booking, sponsor_name: e.target.value })} />
            </label>
            <label>
              Short link name (lowercase letters, numbers and dashes only)
              <input
                type="text"
                required
                pattern="[a-z0-9-]{2,60}"
                placeholder="e.g. acme-ai"
                value={booking.go_slug}
                onChange={(e) => setBooking({ ...booking, go_slug: e.target.value })}
              />
            </label>
            <label>
              Sponsor website link
              <input type="url" required placeholder="https://…" value={booking.target_url} onChange={(e) => setBooking({ ...booking, target_url: e.target.value })} />
            </label>
            <label>
              Headline (optional)
              <input type="text" value={booking.headline} onChange={(e) => setBooking({ ...booking, headline: e.target.value })} />
            </label>
            <label>
              Week starts
              <input type="date" required value={booking.week_start} onChange={(e) => setBooking({ ...booking, week_start: e.target.value })} />
            </label>
            <label>
              Week ends
              <input type="date" required value={booking.week_end} onChange={(e) => setBooking({ ...booking, week_end: e.target.value })} />
            </label>
            <label>
              Price (₹)
              <input type="number" min="0" value={booking.price_inr} onChange={(e) => setBooking({ ...booking, price_inr: e.target.value })} />
            </label>
            <button className="btn" type="submit" disabled={bookingBusy}>
              {bookingBusy ? "Booking…" : "Book sponsor week"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
