import { test, expect } from "@playwright/test";
import { DashboardPage } from "../dashboard/DashboardPage";
import { NavigationMenu } from "../../../components/NavigationMenu";
import { ENV } from "../../../config/environment";
import { log } from "../../../utils/logger";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "../../../pages/auth/LoginPage";

const ESS_AUTH_FILE = path.join(process.cwd(), "fixtures", "auth", "ess-user.json");

test.describe("Authentication - RBAC @auth", () => {
  test.skip(!fs.existsSync(ESS_AUTH_FILE), "ESS auth state not found - run global setup first");

  test.use({ storageState: "fixtures/auth/ess-user.json" });

  let dashboardPage: DashboardPage;
  let navMenu: NavigationMenu;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    navMenu = new NavigationMenu(page);

    await dashboardPage.navigate();
    await page.waitForLoadState("domcontentloaded");

    // const loaded = await dashboardPage.isDashboardLoaded();

    // if (!loaded) {
    //   await page.screenshot({ path: "debug-ess-dashboard-load-failure.png", fullPage: true });
    // }

    // expect(
    //   loaded,
    //   "ESS dashboard failed to load — session may be stale, re-run global setup"
    // ).toBeTruthy();
  });

  // TC-AUTH-016 - ESS User Cannot See Admin Navigation
  test("should not show admin navigation items to ess user @regression @security @auth", async ({
    page,
  }) => {
    // ACT
    const visibleItems = await navMenu.getVisibleMenuItems();

    log.info("Visible menu items for ESS user: " + JSON.stringify(visibleItems));

    // // ASSERT
    expect(
      visibleItems.length,
      "getVisibleMenuItems() found 0 items — check .oxd-main-menu-item-name locator against live DOM"
    ).toBeGreaterThan(0);
    expect(visibleItems.length).toBeLessThan(11);

    const isAdminVisible = await navMenu.isAdminMenuVisible();
    expect(isAdminVisible).toBeFalsy();

    const isPIMVisible = await navMenu.isMenuItemVisible("PIM");
    expect(isPIMVisible).toBeFalsy();

    const isDashboardVisible = await navMenu.isMenuItemVisible("Dashboard");
    expect(isDashboardVisible).toBeTruthy();

    const isMyInfoVisible = await navMenu.isMenuItemVisible("My Info");
    expect(isMyInfoVisible).toBeTruthy();
  });

  // TC-AUTH-017 - ESS User Cannot Access Admin URL Directly
  test("should redirect ess user away from admin url @regression @security @auth", async ({
    page,
  }) => {
    // ACT
    await page.goto(ENV.BASE_URL + "/web/index.php/admin/viewSystemUsers");
    await page.waitForLoadState("domcontentloaded");

    // ASSERT
    const credentialRequired = page.getByText("Credential Required");
    await credentialRequired.waitFor({ state: "visible", timeout: ENV.TIMEOUTS.DEFAULT });

    await expect(credentialRequired).toBeVisible();
    await expect(page.getByText("System Users")).toBeHidden();
  });
});
