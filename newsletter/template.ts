// Weekly newsletter template: one 5-minute AI trick + 5 tool picks (one line each) + "Sponsored by" line.
// Render with renderIssue(...) and paste the HTML into a Resend Broadcast (segment "AI Starter Kit").
// {{{RESEND_UNSUBSCRIBE_URL}}} is filled in by Resend Broadcasts.
export type Pick = { name: string; slug: string; line: string };
export type Issue = { number: number; trickTitle: string; trickSteps: string[]; picks: Pick[]; sponsor?: { name: string; goSlug: string; line: string } | null; siteUrl: string };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export function renderIssue(i: Issue) {
  const u = (p: string) => `${i.siteUrl}${p}${p.includes("?") ? "&" : "?"}utm_source=newsletter&utm_medium=email&utm_campaign=issue-${i.number}`;
  const sponsor = i.sponsor
    ? `<p style="margin:0 0 18px;padding:10px 12px;background:#f5f3ff;border-radius:8px;font-size:14px">Sponsored by <a href="${i.siteUrl}/go/${i.sponsor.goSlug}" style="color:#4f46e5;font-weight:700">${esc(i.sponsor.name)}</a>: ${esc(i.sponsor.line)}</p>`
    : `<p style="margin:0 0 18px;padding:10px 12px;background:#f5f3ff;border-radius:8px;font-size:14px">Sponsored by: this spot is open. <a href="${u("/sponsor")}" style="color:#4f46e5;font-weight:700">Feature your AI tool here</a>.</p>`;
  const html = `<!doctype html><html><body style="margin:0;background:#fbfaf7;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16181d">
<div style="max-width:560px;margin:0 auto;padding:24px 18px">
<p style="margin:0 0 4px;font-weight:800;font-size:18px">AI Starter Kit <span style="color:#5b6170;font-weight:400;font-size:14px">#${i.number}</span></p>
${sponsor}
<h1 style="font-size:22px;line-height:1.25;margin:0 0 8px">This week's 5-minute trick: ${esc(i.trickTitle)}</h1>
<ol style="padding-left:20px;margin:0 0 20px;font-size:16px;line-height:1.55">${i.trickSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
<h2 style="font-size:18px;margin:0 0 8px">5 tools worth a look</h2>
<ul style="padding-left:20px;margin:0 0 20px;font-size:16px;line-height:1.55">${i.picks.slice(0, 5).map((p) => `<li><a href="${u(`/tools/${p.slug}`)}" style="color:#4f46e5;font-weight:700">${esc(p.name)}</a>: ${esc(p.line)}</li>`).join("")}</ul>
<p style="margin:0 0 20px"><a href="${u("/")}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 16px;border-radius:10px;font-weight:700;text-decoration:none">Find a tool for your task →</a></p>
<p style="font-size:12px;color:#5b6170;margin:0">You're getting this because you signed up at AI Starter Kit. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#5b6170">Unsubscribe</a>.</p>
</div></body></html>`;
  const text = `AI Starter Kit #${i.number}\n\n${i.sponsor ? `Sponsored by ${i.sponsor.name}: ${i.sponsor.line} ${i.siteUrl}/go/${i.sponsor.goSlug}` : `Sponsored by: this spot is open. ${i.siteUrl}/sponsor`}\n\nThis week's 5-minute trick: ${i.trickTitle}\n${i.trickSteps.map((s, n) => `${n + 1}. ${s}`).join("\n")}\n\n5 tools worth a look\n${i.picks.slice(0, 5).map((p) => `- ${p.name}: ${p.line} ${i.siteUrl}/tools/${p.slug}`).join("\n")}\n\nUnsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}`;
  return { subject: `#${i.number}: ${i.trickTitle} (5-minute AI trick)`, html, text };
}

export const ISSUE_1: Omit<Issue, "siteUrl"> = {
  number: 1,
  trickTitle: "Turn a messy voice note into a neat to-do list",
  trickSteps: [
    "Open ChatGPT, Claude or Gemini on your phone.",
    "Tap the microphone and ramble everything on your mind for a minute.",
    "Type: \"Turn that into a to-do list grouped by today, this week and later. Keep each item under 8 words.\"",
    "Copy the list into your notes app. Done.",
  ],
  picks: [
    { name: "Gamma", slug: "gamma", line: "type a topic, get a slide deck in a minute." },
    { name: "Perplexity", slug: "perplexity", line: "answers with clickable sources, so you can check facts." },
    { name: "Gemini Notebook", slug: "gemini-notebook", line: "upload your notes and get quiz questions or a spoken summary." },
    { name: "CapCut", slug: "capcut", line: "free video editor with templates and auto-captions." },
    { name: "Suno", slug: "suno", line: "describe a song and it writes and sings it." },
  ],
  sponsor: null,
};
