// Newsletter issues. The cron job (app/api/cron/newsletter) always sends
// the LATEST issue here. To write the next issue, add a new Issue object
// to ISSUES — the cron will pick it up automatically, and it will not
// re-send an issue number that is already recorded in newsletter_sends.
import { ISSUE_1, type Issue } from "./template";

export const ISSUE_2: Omit<Issue, "siteUrl"> = {
  number: 2,
  trickTitle: "Write a job application email in 5 minutes",
  trickSteps: [
    "Open ChatGPT on your phone — the free plan is enough.",
    "Paste the job ad, then add two lines about you: your work and your city.",
    "Type: \"Write a short job application email in simple English, under 120 words, polite and clear, for this job.\"",
    "Paste the result into Grammarly (free) and fix the mistakes it shows.",
    "Read it once out loud. Change any word you would not say yourself, then send.",
  ],
  picks: [
    { name: "ChatGPT", slug: "chatgpt", line: "write the first draft of an email, message or application in simple English." },
    { name: "Grammarly", slug: "grammarly", line: "paste your draft in and it catches spelling and grammar mistakes." },
    { name: "QuillBot", slug: "quillbot", line: "rewrite a stiff sentence in simpler words." },
    { name: "Canva", slug: "canva", line: "make a clean one-page resume with free templates." },
    { name: "Notion", slug: "notion", line: "keep a simple list of jobs you applied to, with dates and replies." },
  ],
  sponsor: null,
};

export const ISSUES: Omit<Issue, "siteUrl">[] = [ISSUE_1, ISSUE_2];

export function latestIssue(): Omit<Issue, "siteUrl"> {
  return ISSUES[ISSUES.length - 1];
}
