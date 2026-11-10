// Usage: npx tsx scripts/render-issue.ts > issue.html
import { renderIssue, ISSUE_1 } from "../newsletter/template";
const out = renderIssue({ ...ISSUE_1, siteUrl: process.env.SITE_URL || "https://aikitstart.com" });
console.log(process.argv[2] === "text" ? out.text : process.argv[2] === "subject" ? out.subject : out.html);
