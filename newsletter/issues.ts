// Newsletter issues. The cron job (app/api/cron/newsletter) always sends
// the LATEST issue here. To write the next issue, add a new Issue object
// to ISSUES — the cron will pick it up automatically, and it will not
// re-send an issue number that is already recorded in newsletter_sends.
import { ISSUE_1, type Issue } from "./template";

export const ISSUES: Omit<Issue, "siteUrl">[] = [ISSUE_1];

export function latestIssue(): Omit<Issue, "siteUrl"> {
  return ISSUES[ISSUES.length - 1];
}
