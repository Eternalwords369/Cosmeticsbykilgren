import { expect, test } from "@playwright/test";
import { sv } from "../lib/copy/sv";

test("home page renders header, hero and footer without horizontal scroll", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(sv.home.heroTitle);
  await expect(page.getByRole("link", { name: sv.nav.home })).toBeVisible();
  await expect(page.getByRole("contentinfo").getByText(sv.footer.promises[0])).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});

test("admin requires login and accepts seeded admin", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);

  await page.getByLabel(sv.admin.email).fill("admin@skafferi.local");
  await page.getByLabel(sv.admin.password).fill("fel-losenord");
  await page.getByRole("button", { name: sv.admin.submit }).click();
  await expect(page.getByText(sv.admin.invalidCredentials)).toBeVisible();

  await page
    .getByLabel(sv.admin.password)
    .fill(process.env.SEED_ADMIN_PASSWORD ?? "byt-mig-direkt");
  await page.getByRole("button", { name: sv.admin.submit }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText(sv.admin.welcome("Administratör"))).toBeVisible();
});
