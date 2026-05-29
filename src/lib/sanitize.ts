/**
 * Content sanitizer — strips contact info from user text.
 * Used in profile fields AND chat messages.
 */

const PHONE_RE = /(?:\+?\d[\s().-]?){7,}\d/g;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/gi;
const URL_RE = /\b(?:https?:\/\/|www\.)\S+/gi;
const HANDLE_RE = /(?:^|\s)@[a-z0-9_.-]{2,}/gi;
const BANNED_WORDS = [
  "whatsapp", "whats app", "wa.me",
  "instagram", "insta\\b", "ig\\b",
  "telegram", "tg\\b",
  "snapchat", "snap chat",
  "facebook", "\\bfb\\b",
  "signal", "viber", "wechat",
];
const BANNED_RE = new RegExp(`\\b(?:${BANNED_WORDS.join("|")})\\b`, "gi");

export interface SanitizeResult {
  cleaned: string;
  hadViolations: boolean;
  violations: string[];
}

export function sanitizeText(input: string): SanitizeResult {
  const violations: string[] = [];
  let out = input;

  if (PHONE_RE.test(out)) violations.push("phone number");
  out = out.replace(PHONE_RE, "[removed]");

  if (EMAIL_RE.test(out)) violations.push("email");
  out = out.replace(EMAIL_RE, "[removed]");

  if (URL_RE.test(out)) violations.push("link");
  out = out.replace(URL_RE, "[removed]");

  if (HANDLE_RE.test(out)) violations.push("social handle");
  out = out.replace(HANDLE_RE, " [removed]");

  if (BANNED_RE.test(out)) violations.push("social platform mention");
  out = out.replace(BANNED_RE, "[removed]");

  return {
    cleaned: out.trim(),
    hadViolations: violations.length > 0,
    violations: [...new Set(violations)],
  };
}

export function hasContactInfo(input: string): boolean {
  return (
    PHONE_RE.test(input) ||
    EMAIL_RE.test(input) ||
    URL_RE.test(input) ||
    HANDLE_RE.test(input) ||
    BANNED_RE.test(input)
  );
}
