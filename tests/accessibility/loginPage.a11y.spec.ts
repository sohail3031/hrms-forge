import { test, expect } from "@playwright/test";

test.describe("Login Page - Accessibility @accessibility", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto("/web/index.php/auth/login");
  });

  test("login page is accessible and loads correctly @accessibility @a11y", async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/OrangeHRM/);

    // Verify all form inputs have visible labels
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();

    // Verify login button is visible
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});
