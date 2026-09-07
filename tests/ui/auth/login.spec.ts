import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/auth/LoginPage";
import { ENV } from "../../../config/environment";
import { allure } from "allure-playwright";

test.describe("Authentication - Login @auth", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.goto(ENV.BASE_URL + "/web/index.php/auth/logout");
  });

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
});
