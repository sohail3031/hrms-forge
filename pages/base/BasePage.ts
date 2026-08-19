import { Page, Locator, expect } from "@playwright/test";
import { log } from "../../utils/logger";
import { ENV } from "../../config/environment";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract get pageUrl(): string;

  async navigate(): Promise<void> {
    const url = ENV.BASE_URL + this.pageUrl;

    log.action("Navigating to: ", url);

    await this.page.goto(url, { waitUntil: "domcontentloaded" });

    await this.waitForPageLoad();

    log.info("Page loaded");
  }

  async navigateTo(url: string): Promise<void> {
    log.action("Navigation", url);

    await this.page.goto(url, { waitUntil: "domcontentloaded" });

    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async waitForApiResponse(
    urlPattern: string | RegExp,
    action: () => Promise<void>
  ): Promise<void> {
    await Promise.all([
      this.page.waitForResponse(
        response =>
          (typeof urlPattern === "string"
            ? response.url().includes(urlPattern)
            : urlPattern.test(response.url())) && response.status() < 400,
        { timeout: ENV.TIMEOUTS.API }
      ),
      action(),
    ]);
  }

  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: timeout || ENV.TIMEOUTS.DEFAULT });
  }

  async waitForElementToDisappear(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout: ENV.TIMEOUTS.DEFAULT });
  }

  async waitForSpinnerToDisappear(): Promise<void> {
    const spinner = this.page.locator(".oxd-loading-spinner");

    try {
      await spinner.waitFor({ state: "hidden", timeout: ENV.TIMEOUTS.DEFAULT });
    } catch (error) {
      if (error instanceof Error) {
        log.debug("Spinner not found (fast operation)", { message: error.message });
      } else {
        log.debug("Spinner not found (fast operation)", { message: String(error) });
      }
    }
  }

  async click(locator: Locator, description: string): Promise<void> {
    log.action("Click", description);

    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  async fill(locator: Locator, value: string, description: string): Promise<void> {
    log.action("Fill", description + ": " + value);

    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  async selectOption(locator: Locator, value: string, description: string): Promise<void> {
    log.action("Select", description + ": " + value);

    await locator.waitFor({ state: "visible" });
    await locator.selectOption(value);
  }

  async clearField(locator: Locator, description: string): Promise<void> {
    log.action("Clear", description);

    await locator.waitFor({ state: "visible" });
    await locator.clear();
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });

    const text = await locator.textContent();

    return text || "";
  }

  async getValue(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });

    return await locator.inputValue();
  }

  isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  async getToastMessage(): Promise<string> {
    const contentToast = this.page.locator(".oxd-toast-content");

    await contentToast.waitFor({ state: "visible", timeout: ENV.TIMEOUTS.ACTION });

    const text = (await contentToast.textContent()) ?? "";

    log.action("Toast", text);

    return text.trim();
  }

  async waitForSuccessToast(): Promise<void> {
    const successToast = this.page.locator(".oxd-toast--success");

    await successToast.waitFor({ state: "visible" });

    log.action("Success Toast", "Success toast appeared");

    await successToast.waitFor({ state: "hidden" });

    log.action("Success Toast", "Success toast dismissed");
  }

  async hasErrorToast(): Promise<boolean> {
    const errorToast = this.page.locator(".oxd-toast--error");

    return await errorToast.isVisible();
  }

  acceptDialog(): void {
    this.page.once("dialog", async dialog => {
      try {
        log.action("Accept Dialog", dialog.message());

        await dialog.accept();
      } catch (error) {
        log.error("Failed to accept dialog", { error: String(error) });
      }
    });
  }

  dismissDialog(): void {
    try {
      this.page.once("dialog", async dialog => {
        log.action("Dismiss Dialog", dialog.message());

        await dialog.dismiss();
      });
    } catch (error) {
      log.error("Failed to accept dialog", { error: String(error) });
    }
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async takeScreenshot(name: string): Promise<void> {
    const screenshotPath = "screenshots/" + name + "-" + Date.now() + ".png";

    await this.page.screenshot({ path: screenshotPath, fullPage: true });

    log.action("Take Screenshot", screenshotPath);
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async pressKey(key: string): Promise<void> {
    log.action("Key Press", key);

    await this.page.keyboard.press(key);
  }

  async getTableRowCount(): Promise<number> {
    const rows = this.page.locator(".oxd-table-body .oxd-table-row");

    return await rows.count();
  }

  async isTableEmpty(): Promise<boolean> {
    const body = this.page.locator(".oxd-table-body");
    const text = await body.textContent();

    return text?.includes("No Records Found") || false;
  }

  async getFieldError(fieldLocator: Locator, timeout?: number): Promise<string> {
    const errorMessage = fieldLocator.locator("..").locator(".oxd-input-field-error-message");

    await errorMessage.waitFor({ state: "visible", timeout: timeout || ENV.TIMEOUTS.DEFAULT });

    return (await errorMessage.textContent()) ?? "";
  }

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    const escaped = expectedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    await expect(this.page).toHaveTitle(new RegExp(escaped, "i"));

    log.assert("Page title contains: " + expectedTitle);
  }
}
