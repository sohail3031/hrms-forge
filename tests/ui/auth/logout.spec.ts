import { test, expect } from "@playwright/test";
import { DashboardPage } from "../dashboard/DashboardPage";
import { ENV } from "../../../config/environment";

test.describe("Authentication - Logout @auth", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);

    await dashboardPage.navigate();

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

  //   TC-AUTH-010 - Protected URL After Logout
  test("should redirect to login when accessing protected URL after logout @regression @security @auth", async ({
    page,
  }) => {
    // ACT
    await dashboardPage.logout();
    await page.goto(ENV.BASE_URL + "/web/index.php/pim/viewEmployeeList");
    await page.waitForURL(/auth\/login/i);

    // ASSERT
    await expect(page).toHaveURL(/auth\/login/i);
    await expect(page.locator(".orangehrm-login-form")).toBeVisible();
  });
});
