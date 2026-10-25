"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import {
  decideLead,
  saveProfile,
  signUp,
  submitFirstProduct,
  unsubscribe,
} from "@/lib/onboarding/service";
import {
  firstProductSchema,
  profileSchema,
  signupSchema,
  type FirstProductInput,
  type ProfileInput,
  type SignupInput,
} from "@/lib/schemas/onboarding";

export type ActionResult = { ok: true } | { ok: false };

export async function signUpAction(values: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) return { ok: false };
  const { website: honeypot, ...input } = parsed.data;
  // Bots fill the honeypot; tell them it worked and do nothing.
  if (honeypot) return { ok: true };

  try {
    await signUp(input);
    return { ok: true };
  } catch (error) {
    console.error("[onboarding] sign-up failed:", error);
    return { ok: false };
  }
}

export async function saveProfileAction(
  token: string,
  values: ProfileInput,
): Promise<ActionResult> {
  if (!profileSchema.safeParse(values).success) return { ok: false };
  return { ok: await saveProfile(token, values) };
}

export async function submitProductAction(
  token: string,
  values: FirstProductInput,
): Promise<ActionResult> {
  if (!firstProductSchema.safeParse(values).success) return { ok: false };
  try {
    return { ok: await submitFirstProduct(token, values) };
  } catch (error) {
    console.error("[onboarding] submit failed:", error);
    return { ok: false };
  }
}

export async function unsubscribeAction(token: string): Promise<void> {
  await unsubscribe(token);
  revalidatePath(`/salj-hos-oss/fortsatt/${token}`);
}

export async function decideLeadAction(leadId: string, approve: boolean): Promise<void> {
  const session = await getAdminSession();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden");
  await decideLead(leadId, approve);
  revalidatePath("/admin");
}
