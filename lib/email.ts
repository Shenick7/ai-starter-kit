import { promises as dns } from "dns";

// Common disposable / throwaway domains. Not exhaustive; MX check below catches many fakes too.
const DISPOSABLE = new Set(`mailinator.com guerrillamail.com guerrillamail.net guerrillamail.org sharklasers.com grr.la 10minutemail.com 10minutemail.net
tempmail.com temp-mail.org temp-mail.io tempmail.net tempmailo.com tempr.email throwawaymail.com yopmail.com yopmail.net yopmail.fr getnada.com nada.email
trashmail.com trashmail.net trashmail.de mailnesia.com maildrop.cc dispostable.com fakeinbox.com mintemail.com mytemp.email emailondeck.com mohmal.com
spamgourmet.com mailcatch.com moakt.com tmail.ws tmpmail.org tmpmail.net burnermail.io discard.email spambox.us mailpoof.com inboxkitten.com
33mail.com anonaddy.me getairmail.com harakirimail.com mail.tm emailfake.com fakemail.net armyspy.com cuvox.de dayrep.com einrot.com fleckens.hu
gustr.com jourrapide.com rhyta.com superrito.com teleworm.us mailforspam.com tempinbox.com spam4.me byom.de luxusmail.org minuteinbox.com
emailtemporanea.net crazymailing.com 1secmail.com 1secmail.net 1secmail.org esiix.com wwjmp.com xojxe.com yoggm.com kzccv.com qiott.com
mailsac.com mvrht.net bccto.me chacuo.net linshiyouxiang.net 20minutemail.com mailtemp.info tempail.com dropmail.me emltmp.com spymail.one`.split(/\s+/));

const COMMON = new Set(["gmail.com","googlemail.com","yahoo.com","yahoo.co.in","outlook.com","hotmail.com","live.com","icloud.com","me.com","proton.me","protonmail.com","rediffmail.com","zoho.com","aol.com"]);
const BLOCKED_EXACT = new Set(["example.com", "example.org", "example.net", "test.com", "test.org", "test.in", "localhost", "invalid", "email.com", "domain.com", "abc.com", "xyz.com", "asdf.com"]);
const JUNK_LOCAL = /^(test|testing|tester|asdf+|qwer(ty)?|abc|abcd|aaa+|xxx+|fake|spam|null|none|noreply|no-reply|admin|user|demo|sample|foo|bar|foobar|a|aa|123+|1234+)(\d*)$/i;

export type EmailCheck = { ok: true; email: string } | { ok: false; reason: string };

export async function checkEmail(raw: string): Promise<EmailCheck> {
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !/^[a-z0-9._%+'-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(email)) return { ok: false, reason: "Please enter a valid email address." };
  const [local, domain] = email.split("@");
  if (local.includes("+test") || JUNK_LOCAL.test(local)) return { ok: false, reason: "Please use your real email address." };
  if (BLOCKED_EXACT.has(domain) || domain.endsWith(".test") || domain.endsWith(".example") || domain.endsWith(".invalid") || domain.endsWith(".local"))
    return { ok: false, reason: "Please use your real email address." };
  if (DISPOSABLE.has(domain) || [...DISPOSABLE].some((d) => domain.endsWith("." + d))) return { ok: false, reason: "Disposable email addresses aren't accepted." };
  if (COMMON.has(domain)) return { ok: true, email };
  const timeout = <T,>(p: Promise<T>) => Promise.race([p, new Promise<never>((_, r) => setTimeout(() => r(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), 3000))]);
  try {
    const mx = await timeout(dns.resolveMx(domain));
    if (mx.length === 0 || mx.every((m) => m.exchange === "" || m.exchange === ".")) return { ok: false, reason: "That email domain can't receive mail." };
  } catch (e: any) {
    if (e?.code === "ENOTFOUND") return { ok: false, reason: "That email domain doesn't exist." };
    if (e?.code === "ENODATA") {
      // No MX record: RFC 5321 falls back to the A record.
      try { const a = await timeout(dns.resolve4(domain)); if (a.length === 0) throw new Error("none"); }
      catch (e2: any) { if (e2?.code !== "ETIMEOUT") return { ok: false, reason: "That email domain can't receive mail." }; }
    }
    // timeouts / transient DNS errors: allow
  }
  return { ok: true, email };
}
