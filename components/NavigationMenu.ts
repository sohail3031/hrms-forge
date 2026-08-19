import { Locator, Page } from "@playwright/test";
import { log } from "../utils/logger";

export class NavigationMenu {
  private readonly moduleName: string = "Navigation";
  private readonly menuItems: Record<string, Locator>;

  constructor(private readonly page: Page) {
    const sidePanel = this.page.locator(".oxd-sidepanel");

    this.menuItems = {
      admin: sidePanel.locator(".oxd-sidepanel").getByRole("link", { name: "Admin", exact: true }),
      pim: sidePanel.locator(".oxd-sidepanel").getByRole("link", { name: "PIM", exact: true }),
      leave: sidePanel.locator(".oxd-sidepanel").getByRole("link", { name: "Leave", exact: true }),
      time: sidePanel.locator(".oxd-sidepanel").getByRole("link", { name: "Time", exact: true }),
      recruitment: sidePanel
        .locator(".oxd-sidepanel")
        .getByRole("link", { name: "Recruitment", exact: true }),
      myInfo: sidePanel
        .locator(".oxd-sidepanel")
        .getByRole("link", { name: "My Info", exact: true }),
      performance: sidePanel
        .locator(".oxd-sidepanel")
        .getByRole("link", { name: "Performance", exact: true }),
      dashboard: sidePanel
        .locator(".oxd-sidepanel")
        .getByRole("link", { name: "Dashboard", exact: true }),
      directory: sidePanel
        .locator(".oxd-sidepanel")
        .getByRole("link", { name: "Directory", exact: true }),
      reports: sidePanel
        .locator(".oxd-sidepanel")
        .getByRole("link", { name: "Reports", exact: true }),
      buzz: sidePanel.locator(".oxd-sidepanel").getByRole("link", { name: "Buzz", exact: true }),
    };
  }

  async goToAdmin(): Promise<void> {
    log.action(this.moduleName, "Admin Module");

    await this.menuItems.admin.click();
  }

  async goToPIM(): Promise<void> {
    log.action(this.moduleName, "PIM Module");

    await this.menuItems.pim.click();
  }

  async goToLeave(): Promise<void> {
    log.action(this.moduleName, "Leave Module");

    await this.menuItems.leave.click();
  }

  async goToTime(): Promise<void> {
    log.action(this.moduleName, "Time Module");

    await this.menuItems.time.click();
  }

  async goToRecruitment(): Promise<void> {
    log.action(this.moduleName, "Recruitment Module");

    await this.menuItems.recruitment.click();
  }

  async goToMyInfo(): Promise<void> {
    log.action(this.moduleName, "My Info Module");

    await this.menuItems.myInfo.click();
  }

  async goToPerformance(): Promise<void> {
    log.action(this.moduleName, "Performance Module");

    await this.menuItems.performance.click();
  }

  async goToDashboard(): Promise<void> {
    log.action(this.moduleName, "Dashboard Module");

    await this.menuItems.dashboard.click();
  }

  async goToDirectory(): Promise<void> {
    log.action(this.moduleName, "Directory Module");

    await this.menuItems.directory.click();
  }

  async goToReports(): Promise<void> {
    log.action(this.moduleName, "Report Module");

    await this.menuItems.reports.click();
  }

  async goToBuzz(): Promise<void> {
    log.action(this.moduleName, "Buzz Module");

    await this.menuItems.buzz.click();
  }

  isAdminMenuVisible(): Promise<boolean> {
    return this.menuItems.admin.isVisible();
  }

  isMenuItemVisible(menuName: string): Promise<boolean> {
    return this.page
      .locator(".oxd-sidepanel")
      .getByRole("link", { name: menuName, exact: true })
      .isVisible();
  }

  async getVisibleMenuItems(): Promise<string[]> {
    const links = this.page.locator(".oxd-main-menu-item-name");
    const itemCount = await links.count();
    const items: string[] = [];

    for (let i = 0; i < itemCount; i++) {
      const text = await links.nth(i).textContent();

      if (text) {
        items.push(text.trim());
      }
    }

    return items;
  }
}
