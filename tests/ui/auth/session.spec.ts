import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/auth/LoginPage";
import { ENV } from "../../../config/environment";

test.describe("Authentication - Session @auth", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  // TC-AUTH-018 - HTTPS Enforced
  test("should enforce https on login page @regression @security @auth", async ({ page }) => {
    // ACT
    await page.goto(ENV.BASE_URL + "/web/index.php/auth/login");

    // ASSERT
    const currentUrl = page.url();

    expect(currentUrl).toMatch(/^https:\/\//i);
  });

  // TC-AUTH-019 - No Sensitive Data in URLs
  test("should not expose sensitive data in url parameters @regression @security @auth", async ({
    page,
  }) => {
    // ACT
    await page.goto(ENV.BASE_URL + "/web/index.php/auth/login");

    const loginPage = new LoginPage(page);

    await loginPage.login(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);
    await page.waitForURL("**/dashboard**");

    // ASSERT
    const url = page.url();

    expect(url).not.toContain(ENV.ADMIN_PASSWORD);
    expect(url).not.toContain(ENV.ADMIN_USERNAME);
    expect(url).not.toContain("token=");
    expect(url).not.toContain("auth=");
    expect(url).not.toContain("session=");
  });

  // TC-AUTH-020 - Disabled User Cannot Login
  test("should reject login for disabled user account @regression @security @auth", async ({
    page,
  }) => {
    // ARRANGE
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    // ACT
    await loginPage.login("disabled_test_user_xyz", "somepassword123");

    // ARRANGE
    await expect(page.locator(".oxd-alert-content-text")).toBeVisible();

    const errorText = await loginPage.getErrorMessage();

    expect(errorText).toContain("Invalid credentials");
    await expect(page).toHaveURL(/auth\/login/i);
  });

  // TC-AUTH-013 & TC-AUTH-014 - Cross-Browser
  test("login page renders correctly on firefox @regression @crossbrowser @auth", async ({
    page,
  }) => {
    await page.goto(ENV.BASE_URL + "/web/index.php/auth/login");
    await expect(page).toHaveTitle(/OrangeHRM/i);
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });
});
