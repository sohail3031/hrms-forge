import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/auth/LoginPage";
import { ENV } from "../../../config/environment";
import { allure } from "allure-playwright";

test.describe("Authentication - Login @auth", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;
  const invalidCredentials = [
    {
      description: "invalid password",
      username: ENV.ADMIN_USERNAME,
      password: "wrongpassword123",
    },
    {
      description: "invalid username",
      username: "nonexistent_user_xyz",
      password: ENV.ADMIN_PASSWORD,
    },
    {
      description: "both invalid",
      username: "fake_user",
      password: "fake_password",
    },
  ];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // await page.goto(ENV.BASE_URL + "/web/index.php/auth/logout");
  });

  // TC-AUTH-001 - Valid Admin Login
  test("should login successfully with valid admin credentials @smoke @critical", async ({
    page,
  }): Promise<void> => {
    void allure.feature("Authentication");
    void allure.story("Valid Login");
    void allure.severity("critical");

    // ACT
    await loginPage.loginAndWaitForDashboard(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);

    // ASSERT
    await expect(page).toHaveURL(/dashboard/i);
    await expect(page).toHaveTitle(/OrangeHRM/i);
    await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
    await expect(page.locator(".oxd-userdropdown-name")).toBeVisible();
  });

  // Data-Driven Approach for TC-AUTH-002 and 003
  for (const { description, username, password } of invalidCredentials) {
    test(`should show error message with ${description} @regression @auth`, async ({ page }) => {
      await loginPage.login(username, password);

      const error = await loginPage.getErrorMessage();

      expect(error).toContain("Invalid credentials");
      await expect(page).toHaveURL(/auth\/login/i);
    });
  }

  // TC-AUTH-004 - Empty Username
  test("should show required error when username is empty @regression @auth", async ({ page }) => {
    // ACT
    await loginPage.enterPassword(ENV.ADMIN_PASSWORD);
    await loginPage.clickLoginButton();

    // ASSERT
    await expect(page.locator(".oxd-input-field-error-message").first()).toBeVisible();

    const error = await loginPage.getUsernameValidationError();

    expect(error).toContain("Required");
    await expect(page).toHaveURL(/auth\/login/i);
  });

  // TC-AUTH-005 - Empty Password
  test("should show required error when password is empty @regression @auth", async ({ page }) => {
    // ACT
    await loginPage.enterUsername(ENV.ADMIN_USERNAME);
    await loginPage.clickLoginButton();

    // ASSERT
    await expect(page.locator(".oxd-input-field-error-message").first()).toBeVisible();

    const error = await loginPage.getPasswordValidationError();

    expect(error).toContain("Required");
    await expect(page).toHaveURL(/auth\/login/i);
  });

  // TC-AUTH-006 - Both Fields Empty
  test("should show required errors when both fields are empty @regression @auth", async ({
    page,
  }) => {
    // ACT
    await loginPage.clickLoginButton();

    // ASSERT
    await expect(page.locator(".oxd-input-field-error-message").first()).toBeVisible();
    await expect(page.locator(".oxd-input-field-error-message").first()).toBeVisible();

    const usernameError = await loginPage.getUsernameValidationError();

    expect(usernameError).toContain("Required");

    const passwordError = await loginPage.getPasswordValidationError();

    expect(passwordError).toContain("Required");
  });

  // TC-AUTH-007 - SQL Injection in Username
  test("should not allow sql injection in username field @regression @auth", async ({ page }) => {
    // ACT
    await loginPage.login("' OR 1=1 --", "anypassword");

    // ASSERT
    const error = await loginPage.getErrorMessage();

    expect(error).toContain("Invalid credentials");
    await expect(page).toHaveURL(/auth\/login/i);
  });

  // TC-AUTH-008 - XSS Payload in Username
  test("should sanitize xss payload in username field @regression @security @auth", async ({
    page,
  }) => {
    // ACT
    await loginPage.login("<script>alert('xss')</script>", "anypassword");

    // ASSERT
    const error = await loginPage.getErrorMessage();

    expect(error).toContain("Invalid credentials");
    await expect(page).toHaveTitle(/OrangeHRM/i);
  });

  // TC-AUTH-011 - Password Field Is Masked
  test("should mask password input field @regression @auth", async ({ page }) => {
    // ASSERT
    const isMasked = await loginPage.isPasswordMasked();

    expect(isMasked).toBeTruthy();
  });

  // TC-AUTH-012 - Login Page Loads Within 3 Seconds
  test("should load login page within 3 seconds @regression @performance @auth", async ({
    page,
  }) => {
    // ACT
    const startTime = Date.now();

    await page.goto(ENV.BASE_URL + "/web/index.php/auth/login", { waitUntil: "domcontentloaded" });

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // ASSERT
    expect(loadTime).toBeLessThan(3000);
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
  });

  // Login Page Renders Correctly Across Browsers
  test("login page renders correctly across browsers @crossbrowser @auth", async ({ page }) => {
    await expect(page).toHaveTitle(/OrangeHRM/i);
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
  });
});
