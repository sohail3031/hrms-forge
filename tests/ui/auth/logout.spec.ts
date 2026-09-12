import { test, expect } from "@playwright/test";
import { DashboardPage } from "../dashboard/DashboardPage";
import { ENV } from "../../../config/environment";
import { LoginPage } from "../../../pages/auth/LoginPage";

test.describe("Authentication - Logout @auth", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }, testInfo) => {
    if (
      testInfo.title == "should maintain session when navigating between modules @regression @auth"
    ) {
      return;
    }

    const loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.loginAndWaitForDashboard(ENV.ADMIN_USERNAME, ENV.ADMIN_PASSWORD);

    const loaded = await dashboardPage.isDashboardLoaded();
    expect(loaded).toBeTruthy();
  });

  // TC-AUTH-009 - Logout Destroys Session
  test("should logout successfully and redirect to login page @smoke @critical @auth", async ({
    page,
  }): Promise<void> => {
    // ACT
    await dashboardPage.logout();

    // ASSERT
    await expect(page).toHaveURL(/auth\/login/i);
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
    await expect(page.locator(".oxd-userdropdown-tab")).toBeHidden();
  });

  // TC-AUTH-010 - Protected URL After Logout
  test("should redirect to login when accessing protected URL after logout @regression @security @auth", async ({
    page,
  }) => {
    // ACT
    await dashboardPage.logout();
    await page.goto(ENV.BASE_URL + "/web/index.php/pim/viewEmployeeList");
    await page.waitForURL(/auth\/login/i, { timeout: ENV.TIMEOUTS.NAVIGATION });

    // ASSERT
    await expect(page).toHaveURL(/auth\/login/i);
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
  });

  // TC-AUTH-015 - Session Persists Across Navigation
  test("should maintain session when navigating between modules @regression @auth", async ({
    page,
  }) => {
    await page.goto(ENV.BASE_URL + "/web/index.php/pim/viewEmployeeList");
    await expect(page).toHaveURL(/auth\/login/i);

    await page.goto(ENV.BASE_URL + "/web/index.php/leave/viewLeaveList");
    await expect(page).toHaveURL(/auth\/login/i);

    await page.goto(ENV.BASE_URL + "/web/index.php/admin/viewSystemUsers");
    await expect(page).toHaveURL(/auth\/login/i);
    await expect(page.locator(".oxd-userdropdown-tab")).toBeHidden();
  });
});
