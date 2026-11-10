// Weekly newsletter template: one 5-minute AI trick + 5 tool picks (one line each) + "Sponsored by" line.
// Render with renderIssue(...) and paste the HTML into a Resend Broadcast (segment "AI Starter Kit").
// {{{RESEND_UNSUBSCRIBE_URL}}} is filled in by Resend Broadcasts.
export type Pick = { name: string; slug: string; line: string };
export type Issue = { number: number; trickTitle: string; trickSteps: string[]; picks: Pick[]; sponsor?: { name: string; goSlug: string; line: string } | null; siteUrl: string };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export function renderIssue(i: Issue) {
  const u = (p: string) => `${i.siteUrl}${p}${p.includes("?") ? "&" : "?"}utm_source=newsletter&utm_medium=email&utm_campaign=issue-${i.number}`;
  const F = "font-family:Arial,Helvetica,sans-serif;color:#16181d;";
  const sponsorInner = i.sponsor
    ? `Sponsored by <a href="${i.siteUrl}/go/${i.sponsor.goSlug}" style="color:#4f46e5;font-weight:bold">${esc(i.sponsor.name)}</a>: ${esc(i.sponsor.line)}`
    : `Sponsored by: this spot is open. <a href="${u("/sponsor")}" style="color:#4f46e5;font-weight:bold">Feature your AI tool here</a>.`;
  const row = (inner: string, pad = "0 0 18px 0") => `<tr><td style="padding:${pad}">${inner}</td></tr>`;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>AI Starter Kit #${i.number}</title></head>
<body style="margin:0;padding:0;background-color:#fbfaf7">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fbfaf7" style="background-color:#fbfaf7"><tr><td align="center" style="padding-top:24px;padding-bottom:24px;padding-left:16px;padding-right:16px">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
${row(`<p style="${F}margin:0;font-size:18px;line-height:24px;font-weight:bold">AI Starter Kit <span style="color:#5b6170;font-weight:normal;font-size:14px">#${i.number}</span></p>`, "0 0 12px 0")}
${row(`<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f5f3ff" style="background-color:#f5f3ff;padding-top:10px;padding-bottom:10px;padding-left:12px;padding-right:12px;${F}font-size:14px;line-height:20px">${sponsorInner}</td></tr></table>`)}
${row(`<h1 style="${F}font-size:22px;line-height:28px;margin:0">This week's 5-minute trick: ${esc(i.trickTitle)}</h1>`, "0 0 8px 0")}
${row(`<ol style="${F}padding-left:20px;margin:0;font-size:16px;line-height:24px">${i.trickSteps.map((s) => `<li style="${F}font-size:16px;line-height:24px">${esc(s)}</li>`).join("")}</ol>`, "0 0 20px 0")}
${row(`<h2 style="${F}font-size:18px;line-height:24px;margin:0">5 tools worth a look</h2>`, "0 0 8px 0")}
${row(`<ul style="${F}padding-left:20px;margin:0;font-size:16px;line-height:24px">${i.picks.slice(0, 5).map((p) => `<li style="${F}font-size:16px;line-height:24px"><a href="${u(`/tools/${p.slug}`)}" style="color:#4f46e5;font-weight:bold">${esc(p.name)}</a>: ${esc(p.line)}</li>`).join("")}</ul>`, "0 0 20px 0")}
${row(`<table cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#4f46e5" style="background-color:#4f46e5;padding-top:10px;padding-bottom:10px;padding-left:16px;padding-right:16px"><a href="${u("/")}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;color:#ffffff;font-weight:bold;text-decoration:none">Find a tool for your task &rarr;</a></td></tr></table>`, "0 0 20px 0")}
${row(`<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#5b6170;margin:0">You're getting this because you signed up at AI Starter Kit. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#5b6170">Unsubscribe</a>.</p>`, "0")}
</table></td></tr></table></body></html>`;
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
