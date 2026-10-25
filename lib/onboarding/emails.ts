import { sv } from "@/lib/copy/sv";
import type { EmailTemplate } from "@/lib/onboarding/sequence";

export type EmailContext = {
  contactName: string;
  farmName: string;
  link: string;
  replyBy?: string;
  senderName?: string;
};

export function firstName(contactName: string): string {
  return contactName.trim().split(/\s+/)[0] ?? contactName;
}

/** Plain text only: one link, one next step, a human reply-to. */
export function renderEmail(
  template: EmailTemplate,
  ctx: EmailContext,
): { subject: string; text: string } {
  const copy = sv.onboardingEmails;
  const name = firstName(ctx.contactName);

  const body =
    template === "submitted"
      ? copy.submitted.body(name, ctx.farmName, ctx.link, ctx.replyBy ?? "")
      : copy[template].body(name, ctx.farmName, ctx.link);

  // Reminders get a way out; answers to the producer's own application always go out.
  const isReminder =
    template === "profile_reminder" || template === "product_reminder" || template === "last_call";
  const parts = [body, copy.replyNote, copy.signOff(ctx.senderName)];
  if (isReminder || template === "welcome") parts.push(`--\n${copy.footer(ctx.link)}`);

  return { subject: copy[template].subject(ctx.farmName), text: parts.join("\n\n") };
}

const longDate = new Intl.DateTimeFormat("sv-SE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Stockholm",
});

/** "tisdag 28 oktober" */
export function formatLongDate(date: Date): string {
  return longDate.format(date);
}
