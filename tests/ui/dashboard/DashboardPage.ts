import { Page } from "@playwright/test";
import { BasePage } from "../../../pages/base/BasePage";
import { log } from "../../../utils/logger";
import { ENV } from "../../../config/environment";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get pageUrl(): string {
    return "/web/index.php/dashboard/index";
  }

  private readonly userDropdownToggle = this.page.locator(".oxd-userdropdown-tab");
  private readonly logoutMenuItem = this.page.getByRole("menuitem", { name: "Logout" });
  private readonly userDisplayName = this.page.locator(".oxd-userdropdown-name");
  private readonly dashboardHeading = this.page.getByRole("heading", { name: "Dashboard" });

  async isDashboardLoaded(): Promise<boolean> {
    await this.waitForElement(this.dashboardHeading);

    return await this.isVisible(this.dashboardHeading);
  }

  async logout(): Promise<void> {
    log.step(1, "Click user dropdown");

    await this.click(this.userDropdownToggle, "User dropdown toggle");

    log.step(2, "Click logout menu item");

    await this.click(this.logoutMenuItem, "Logout menu item");
    await this.page.waitForURL("**/auth/login**", { timeout: ENV.TIMEOUTS.NAVIGATION });

    log.info("Logout successful - redirecting to login");
  }

  async getUserDisplayName(): Promise<string> {
    await this.waitForElement(this.userDisplayName);

    return this.getText(this.userDisplayName);
  }

  async isUserDropdownVisible(): Promise<boolean> {
    return await this.isVisible(this.userDropdownToggle);
  }
}
