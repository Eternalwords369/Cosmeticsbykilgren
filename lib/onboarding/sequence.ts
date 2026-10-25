/**
 * Which onboarding email a producer lead should get next, decided by what they
 * have done, not by a fixed schedule. One small next step per email, never more
 * than one email in two days, and an honest last email before we stop.
 */

export type LeadStageName =
  "STARTED" | "PROFILE_DONE" | "SUBMITTED" | "APPROVED" | "DECLINED" | "CLOSED";

export type NudgeTemplate = "profile_reminder" | "product_reminder" | "last_call";
export type EmailTemplate = NudgeTemplate | "welcome" | "submitted" | "approved" | "declined";

export type LeadForSequence = {
  stage: LeadStageName;
  stageChangedAt: Date;
  unsubscribedAt: Date | null;
  sent: { template: string; sentAt: Date }[];
};

export type SequenceStep = { kind: "email"; template: NudgeTemplate } | { kind: "close" } | null;

const DAY = 86_400_000;
export const REMINDER_AFTER_DAYS = 2;
export const LAST_CALL_AFTER_DAYS = 6;
/** Days after the last call before an unanswered lead is closed. Stated in that email. */
export const CLOSE_AFTER_LAST_CALL_DAYS = 7;
/** Leads stalled this long are closed even without a last call. */
export const CLOSE_STALLED_DAYS = 30;
export const MIN_DAYS_BETWEEN_EMAILS = 2;

const reminderFor: Partial<Record<LeadStageName, NudgeTemplate>> = {
  STARTED: "profile_reminder",
  PROFILE_DONE: "product_reminder",
};

export function nextStep(lead: LeadForSequence, now: Date): SequenceStep {
  const reminder = reminderFor[lead.stage];
  if (!reminder || lead.unsubscribedAt) return null;

  const daysInStage = (now.getTime() - lead.stageChangedAt.getTime()) / DAY;
  const sentAt = (template: string) => lead.sent.find((s) => s.template === template)?.sentAt;

  const lastCall = sentAt("last_call");
  const lastCallUnanswered = lastCall && lastCall >= lead.stageChangedAt;
  if (
    (lastCallUnanswered &&
      now.getTime() - lastCall.getTime() >= CLOSE_AFTER_LAST_CALL_DAYS * DAY) ||
    daysInStage >= CLOSE_STALLED_DAYS
  ) {
    return { kind: "close" };
  }

  const latest = Math.max(0, ...lead.sent.map((s) => s.sentAt.getTime()));
  if (now.getTime() - latest < MIN_DAYS_BETWEEN_EMAILS * DAY) return null;

  if (daysInStage >= LAST_CALL_AFTER_DAYS && !lastCall)
    return { kind: "email", template: "last_call" };
  if (daysInStage >= REMINDER_AFTER_DAYS && !sentAt(reminder)) {
    return { kind: "email", template: reminder };
  }
  return null;
}

/** Monday–Friday only; good enough for a promise like "svar inom två arbetsdagar". */
export function addBusinessDays(from: Date, days: number): Date {
  const date = new Date(from);
  let left = days;
  while (left > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) left--;
  }
  return date;
}

/** Steps shown to the producer. Step 1 is done the moment they sign up. */
export function completedSteps(stage: LeadStageName): number {
  switch (stage) {
    case "STARTED":
      return 1;
    case "PROFILE_DONE":
      return 2;
    case "SUBMITTED":
      return 3;
    case "APPROVED":
      return 4;
    default:
      return 0;
  }
}
