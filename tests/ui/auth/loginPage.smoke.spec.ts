import { test, expect } from "@playwright/test";

/**
 * Login Page Smoke Tests
 *
 * Purpose: Verify OrangeHRM application is accurate and login page renders
 *          correctly. These tests run on every push as CI health checks.
 * Tags:    @smoke @auth @chromium
 */

test.describe("Login Page - Smoke @smoke", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto("/web/index.php/auth/login");
  });

  test("application is accessible and login page loads @smoke @auth", async ({ page }) => {
    // Verify page title contains OrangeHRM
    await expect(page).toHaveTitle(/OrangeHRM/);

    // Verify login form elements are visible
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("login page URL is correct @smoke @auth", async ({ page }) => {
    await expect(page).toHaveURL(/auth\/login/);
  });
});
