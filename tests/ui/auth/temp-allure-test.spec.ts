import { test, expect } from "@playwright/test";

test.describe("Allure Reporter Verification @smoke", () => {
  test("verify allure reporter captures test metadata", async ({ page }) => {
    // Navigate to OrangeHrm login page
    await page.goto("/web/index.php/auth/login");

    // Verify page title
    await expect(page).toHaveTitle(/OrangeHRM/);

    // Verify login form is visible
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });
});
