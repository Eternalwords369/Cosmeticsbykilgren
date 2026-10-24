import { describe, expect, it } from "vitest";
import { sv } from "@/lib/copy/sv";
import { loginSchema } from "@/lib/schemas/auth";

describe("loginSchema", () => {
  it("normalises email", () => {
    const result = loginSchema.parse({ email: "  Admin@Skafferi.SE ", password: "x" });
    expect(result.email).toBe("admin@skafferi.se");
  });

  it("returns Swedish error messages", () => {
    const result = loginSchema.safeParse({ email: "inte-en-adress", password: "" });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toContain(sv.validation.emailInvalid);
    expect(messages).toContain(sv.validation.passwordRequired);
  });
});
