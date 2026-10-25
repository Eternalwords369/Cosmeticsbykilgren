import "server-only";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { formatLongDate, renderEmail } from "@/lib/onboarding/emails";
import {
  addBusinessDays,
  type EmailTemplate,
  type NudgeTemplate,
  nextStep,
} from "@/lib/onboarding/sequence";
import {
  createNonce,
  leadIdFromToken,
  signLeadToken,
  verifyLeadToken,
} from "@/lib/onboarding/token";
import type { FirstProductInput, ProfileInput, SignupInput } from "@/lib/schemas/onboarding";
import { firstProductSchema, profileSchema } from "@/lib/schemas/onboarding";
import { absoluteUrl } from "@/lib/seo";

/** Promised in the "submitted" email and on the page. */
export const REVIEW_BUSINESS_DAYS = 2;
const NUDGES: NudgeTemplate[] = ["profile_reminder", "product_reminder", "last_call"];

const leadSelect = {
  id: true,
  email: true,
  contactName: true,
  farmName: true,
  stage: true,
  stageChangedAt: true,
  tokenNonce: true,
  profile: true,
  firstProduct: true,
  unsubscribedAt: true,
} as const;

type Lead = NonNullable<Awaited<ReturnType<typeof findLead>>>;

function findLead(id: string) {
  return db.producerLead.findUnique({ where: { id }, select: leadSelect });
}

export function continueUrl(lead: Pick<Lead, "id" | "tokenNonce">): string {
  return absoluteUrl(`/salj-hos-oss/fortsatt/${signLeadToken(lead.id, lead.tokenNonce)}`);
}

export function reviewDeadline(submittedAt: Date): Date {
  return addBusinessDays(submittedAt, REVIEW_BUSINESS_DAYS);
}

async function deliver(lead: Lead, template: EmailTemplate): Promise<void> {
  const { subject, text } = renderEmail(template, {
    contactName: lead.contactName,
    farmName: lead.farmName,
    link: continueUrl(lead),
    replyBy: formatLongDate(reviewDeadline(lead.stageChangedAt)),
    senderName: process.env.ONBOARDING_SENDER_NAME || undefined,
  });
  await sendEmail({ to: lead.email, subject, text });
  await db.leadEmail.upsert({
    where: { leadId_template: { leadId: lead.id, template } },
    create: { leadId: lead.id, template },
    update: { sentAt: new Date() },
  });
}

/**
 * Same answer for new and known addresses, so the form never reveals who has
 * applied. A known address gets a fresh link; a closed application reopens.
 */
export async function signUp(input: Omit<SignupInput, "website">): Promise<void> {
  const existing = await db.producerLead.findUnique({
    where: { email: input.email },
    select: { id: true, stage: true },
  });

  if (!existing) {
    const lead = await db.producerLead.create({
      data: { ...input, tokenNonce: createNonce() },
      select: leadSelect,
    });
    await deliver(lead, "welcome");
    return;
  }
  if (existing.stage === "DECLINED") return;

  if (existing.stage === "CLOSED") {
    await db.leadEmail.deleteMany({ where: { leadId: existing.id, template: { in: NUDGES } } });
  }
  const lead = await db.producerLead.update({
    where: { id: existing.id },
    data: {
      tokenNonce: createNonce(),
      unsubscribedAt: null,
      ...(existing.stage === "CLOSED"
        ? { ...input, stage: "STARTED", stageChangedAt: new Date() }
        : {}),
    },
    select: leadSelect,
  });
  await deliver(lead, "welcome");
}

export async function getLeadByToken(token: string): Promise<Lead | null> {
  const id = leadIdFromToken(token);
  if (!id) return null;
  const lead = await findLead(id);
  return lead && verifyLeadToken(token, lead.tokenNonce) ? lead : null;
}

export async function saveProfile(token: string, input: ProfileInput): Promise<boolean> {
  const lead = await getLeadByToken(token);
  if (!lead || (lead.stage !== "STARTED" && lead.stage !== "PROFILE_DONE")) return false;
  const profile = profileSchema.parse(input);

  await db.producerLead.update({
    where: { id: lead.id },
    data: {
      profile,
      ...(lead.stage === "STARTED" ? { stage: "PROFILE_DONE", stageChangedAt: new Date() } : {}),
    },
  });
  return true;
}

export async function submitFirstProduct(
  token: string,
  input: FirstProductInput,
): Promise<boolean> {
  const lead = await getLeadByToken(token);
  if (!lead || lead.stage !== "PROFILE_DONE") return false;
  const firstProduct = firstProductSchema.parse(input);

  const updated = await db.producerLead.update({
    where: { id: lead.id },
    data: { firstProduct, stage: "SUBMITTED", stageChangedAt: new Date() },
    select: leadSelect,
  });
  await deliver(updated, "submitted");
  return true;
}

export async function unsubscribe(token: string): Promise<boolean> {
  const lead = await getLeadByToken(token);
  if (!lead) return false;
  await db.producerLead.update({ where: { id: lead.id }, data: { unsubscribedAt: new Date() } });
  return true;
}

/** Admin decision. Callers must check the ADMIN role. */
export async function decideLead(leadId: string, approve: boolean): Promise<void> {
  const { count } = await db.producerLead.updateMany({
    where: { id: leadId, stage: "SUBMITTED" },
    data: { stage: approve ? "APPROVED" : "DECLINED", stageChangedAt: new Date() },
  });
  if (count === 0) return;
  const lead = await findLead(leadId);
  if (lead) await deliver(lead, approve ? "approved" : "declined");
}

/** Daily cron: one reminder or a close per stalled lead. Returns what was done. */
export async function runOnboardingSequence(now = new Date()) {
  const leads = await db.producerLead.findMany({
    where: { stage: { in: ["STARTED", "PROFILE_DONE"] }, unsubscribedAt: null },
    select: { ...leadSelect, emails: { select: { template: true, sentAt: true } } },
  });

  const result = { emailed: 0, closed: 0, failed: 0 };
  for (const { emails, ...lead } of leads) {
    const step = nextStep({ ...lead, sent: emails }, now);
    if (!step) continue;
    try {
      if (step.kind === "close") {
        await db.producerLead.update({
          where: { id: lead.id },
          data: { stage: "CLOSED", stageChangedAt: now },
        });
        result.closed++;
      } else {
        await deliver(lead, step.template);
        result.emailed++;
      }
    } catch (error) {
      console.error(`[onboarding] lead ${lead.id}:`, error);
      result.failed++;
    }
  }
  return result;
}

export function listLeads() {
  return db.producerLead.findMany({
    orderBy: [{ stageChangedAt: "desc" }],
    take: 100,
    select: {
      id: true,
      contactName: true,
      email: true,
      farmName: true,
      sells: true,
      stage: true,
      stageChangedAt: true,
      profile: true,
      firstProduct: true,
      unsubscribedAt: true,
    },
  });
}
