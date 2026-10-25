import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Magic-link tokens: `<leadId>.<signature>`. The signature covers a per-lead
 * nonce, so any email can carry a fresh copy of the same link, and rotating
 * the nonce revokes every link sent so far. A database leak alone forges nothing.
 */
export function createNonce(): string {
  return randomBytes(16).toString("base64url");
}

export function signLeadToken(leadId: string, nonce: string, secret = tokenSecret()): string {
  return `${leadId}.${signature(leadId, nonce, secret)}`;
}

/** The lead id the token claims; verify it with `verifyLeadToken` once the nonce is loaded. */
export function leadIdFromToken(token: string): string | null {
  const [leadId, sig, extra] = token.split(".");
  return leadId && sig && extra === undefined ? leadId : null;
}

export function verifyLeadToken(token: string, nonce: string, secret = tokenSecret()): boolean {
  const leadId = leadIdFromToken(token);
  if (!leadId) return false;
  const expected = Buffer.from(signLeadToken(leadId, nonce, secret));
  const actual = Buffer.from(token);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function signature(leadId: string, nonce: string, secret: string): string {
  return createHmac("sha256", secret).update(`onboarding:${leadId}:${nonce}`).digest("base64url");
}

function tokenSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is required to sign onboarding links");
  return secret;
}
