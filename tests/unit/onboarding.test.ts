import { describe, expect, it } from "vitest";
import { sv } from "@/lib/copy/sv";
import { firstName, renderEmail } from "@/lib/onboarding/emails";
import {
  addBusinessDays,
  completedSteps,
  type LeadForSequence,
  nextStep,
} from "@/lib/onboarding/sequence";
import {
  createNonce,
  leadIdFromToken,
  signLeadToken,
  verifyLeadToken,
} from "@/lib/onboarding/token";
import { firstProductSchema, profileSchema, signupSchema } from "@/lib/schemas/onboarding";

const DAY = 86_400_000;
const start = new Date("2026-10-26T06:00:00Z");
const at = (days: number) => new Date(start.getTime() + days * DAY);
const lead = (overrides: Partial<LeadForSequence> = {}): LeadForSequence => ({
  stage: "STARTED",
  stageChangedAt: start,
  unsubscribedAt: null,
  sent: [{ template: "welcome", sentAt: start }],
  ...overrides,
});

describe("nextStep", () => {
  it("waits two days before the first reminder", () => {
    expect(nextStep(lead(), at(1))).toBeNull();
    expect(nextStep(lead(), at(2))).toEqual({ kind: "email", template: "profile_reminder" });
  });

  it("asks for the step the producer is actually on", () => {
    const profileDone = lead({ stage: "PROFILE_DONE", stageChangedAt: at(1) });
    expect(nextStep(profileDone, at(3))).toEqual({ kind: "email", template: "product_reminder" });
  });

  it("sends one honest last call, then closes a week later", () => {
    const reminded = lead({
      sent: [
        { template: "welcome", sentAt: start },
        { template: "profile_reminder", sentAt: at(2) },
      ],
    });
    expect(nextStep(reminded, at(3))).toBeNull();
    expect(nextStep(reminded, at(6))).toEqual({ kind: "email", template: "last_call" });

    const lastCalled = {
      ...reminded,
      sent: [...reminded.sent, { template: "last_call", sentAt: at(6) }],
    };
    expect(nextStep(lastCalled, at(12))).toBeNull();
    expect(nextStep(lastCalled, at(13))).toEqual({ kind: "close" });
  });

  it("never sends two emails within two days", () => {
    const justMailed = lead({ sent: [{ template: "welcome", sentAt: at(6) }] });
    expect(nextStep(justMailed, at(7))).toBeNull();
  });

  it("does not close a lead that moved on after the last call", () => {
    const movedOn = lead({
      stage: "PROFILE_DONE",
      stageChangedAt: at(8),
      sent: [
        { template: "welcome", sentAt: start },
        { template: "last_call", sentAt: at(6) },
      ],
    });
    expect(nextStep(movedOn, at(14))).toEqual({ kind: "email", template: "product_reminder" });
  });

  it("stays quiet when unsubscribed, waiting on us or done", () => {
    expect(nextStep(lead({ unsubscribedAt: at(1) }), at(5))).toBeNull();
    for (const stage of ["SUBMITTED", "APPROVED", "DECLINED", "CLOSED"] as const) {
      expect(nextStep(lead({ stage }), at(40))).toBeNull();
    }
  });
});

describe("addBusinessDays", () => {
  it("skips the weekend", () => {
    const friday = new Date("2026-10-30T10:00:00Z");
    expect(addBusinessDays(friday, 2).toISOString().slice(0, 10)).toBe("2026-11-03");
  });
});

describe("completedSteps", () => {
  it("counts sign-up as the first finished step", () => {
    expect(completedSteps("STARTED")).toBe(1);
    expect(completedSteps("APPROVED")).toBe(4);
  });
});

describe("lead tokens", () => {
  const secret = "test-secret";

  it("verifies its own signature and nothing else", () => {
    const nonce = createNonce();
    const token = signLeadToken("lead123", nonce, secret);
    expect(leadIdFromToken(token)).toBe("lead123");
    expect(verifyLeadToken(token, nonce, secret)).toBe(true);
    expect(verifyLeadToken(token, createNonce(), secret)).toBe(false);
    expect(
      verifyLeadToken(
        signLeadToken("other", nonce, secret).replace("other", "lead123"),
        nonce,
        secret,
      ),
    ).toBe(false);
    expect(leadIdFromToken("garbage")).toBeNull();
  });
});

describe("renderEmail", () => {
  const ctx = { contactName: "Anna Berg", farmName: "Bergs gård", link: "https://x.se/l" };

  it("is personal, has one link and a way out on reminders", () => {
    const { subject, text } = renderEmail("profile_reminder", ctx);
    expect(subject).toContain("Bergs gård");
    expect(text).toMatch(/^Hej Anna!/);
    expect(text).toContain(sv.onboardingEmails.replyNote);
    expect(text).toContain(sv.onboardingEmails.footer(ctx.link));
  });

  it("puts the review deadline in the submitted email", () => {
    const { text } = renderEmail("submitted", { ...ctx, replyBy: "tisdag 3 november" });
    expect(text).toContain("tisdag 3 november");
    expect(text).not.toContain(sv.onboardingEmails.footer(ctx.link));
  });

  it("signs with a real name when one is set", () => {
    expect(renderEmail("welcome", { ...ctx, senderName: "Maja" }).text).toContain(
      "Maja\nVärmlandsnäs Skafferi",
    );
  });

  it("uses the first name only", () => {
    expect(firstName("  Per-Olof Andersson ")).toBe("Per-Olof");
  });
});

describe("onboarding schemas", () => {
  it("accepts a filled honeypot so bots get a silent ok", () => {
    const parsed = signupSchema.safeParse({
      contactName: "A",
      farmName: "B",
      email: "A@Gard.SE ",
      sells: "ost",
      website: "spam",
    });
    expect(parsed.success && parsed.data.email).toBe("a@gard.se");
  });

  it("asks for a real story", () => {
    const base = { address: "Näset 1, 661 91 Säffle", phone: "", website: "", pickup: true };
    expect(profileSchema.safeParse({ ...base, story: "Kort." }).success).toBe(false);
    const ok = profileSchema.parse({ ...base, story: "x".repeat(80) });
    expect(ok.phone).toBeUndefined();
  });

  it("reads Swedish prices into öre", () => {
    const parsed = firstProductSchema.parse({
      name: "Getost",
      price: "89,50",
      unit: "200 g",
      vatRate: "12",
      description: "Mild",
    });
    expect(parsed).toMatchObject({ price: 8950, vatRate: 12 });
    expect(firstProductSchema.safeParse({ ...parsed, price: "0", vatRate: "12" }).success).toBe(
      false,
    );
  });
});
