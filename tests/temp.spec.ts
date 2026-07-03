// tests/example.spec.ts

import { test, expect } from "@playwright/test";

test("@smoke Home page opens", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.*/);
});
