import { z } from "zod";
import { sv } from "@/lib/copy/sv";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(sv.validation.emailInvalid),
  password: z.string().min(1, sv.validation.passwordRequired),
});

export type LoginInput = z.infer<typeof loginSchema>;
