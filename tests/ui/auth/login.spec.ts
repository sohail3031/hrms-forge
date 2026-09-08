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

  // TC-AUTH-002 - Invalid Password
  // test("should show error message with invalid password @regression @auth", async ({ page }) => {
  //   // ACT
  //   await loginPage.login(ENV.ADMIN_USERNAME, "wrongpassword123");

  //   // ASSERT
  //   await expect(page.locator(".oxd-alert-content-text")).toBeVisible();

  //   const errorText = await loginPage.getErrorMessage();

  //   expect(errorText).toContain("Invalid credentials");
  //   await expect(page).toHaveURL(/auth\/login/i);
  // });

  // TC-AUTH-003 - Invalid Username
  // test("should show error message with invalid username @regression @auth", async ({ page }) => {
  //   // ACT
  //   await loginPage.login("nonexistent_user_xyz", ENV.ADMIN_PASSWORD);

  //   // ASSERT
  //   await expect(page.locator(".oxd-alert-content-text")).toBeVisible();

  //   const errorText = await loginPage.getErrorMessage();

  //   expect(errorText).toContain("Invalid credentials");
  //   await expect(page).toHaveURL(/auth\/login/i);
  // });

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
});
