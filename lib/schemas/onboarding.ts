import { z } from "zod";
import { sv } from "@/lib/copy/sv";

const v = sv.validation;
const text = (max: number) => z.string().trim().min(1, v.required).max(max, v.tooLong(max));
const optional = (schema: z.ZodString) =>
  z.union([z.literal(""), schema]).transform((value) => value || undefined);

export const STORY_MIN = 80;

export const signupSchema = z.object({
  contactName: text(80),
  farmName: text(100),
  email: z.string().trim().toLowerCase().email(v.emailInvalid).max(200),
  sells: text(200),
  // Honeypot: real people never see or fill this.
  website: z.string().max(500).optional(),
});
export type SignupInput = z.input<typeof signupSchema>;

export const profileSchema = z.object({
  address: text(200),
  phone: optional(z.string().trim().max(30, v.tooLong(30))),
  website: optional(z.string().trim().url(v.urlInvalid).max(200)),
  story: z.string().trim().min(STORY_MIN, v.storyTooShort(STORY_MIN)).max(4000, v.tooLong(4000)),
  pickup: z.boolean(),
});
export type ProfileInput = z.input<typeof profileSchema>;

export const firstProductSchema = z.object({
  name: text(100),
  price: z
    .string()
    .trim()
    .regex(/^\d{1,5}([.,]\d{1,2})?$/, v.priceInvalid)
    .transform((value) => Math.round(Number(value.replace(",", ".")) * 100))
    .refine((ore) => ore > 0, v.priceInvalid),
  unit: text(40),
  vatRate: z.enum(["12", "25"]).transform(Number),
  description: text(600),
});
export type FirstProductInput = z.input<typeof firstProductSchema>;
