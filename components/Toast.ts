import { Locator, Page } from "@playwright/test";
import { ENV } from "../config/environment";
import { log } from "../utils/logger";

/**
 * Handles OrangeHRM toast notification interactions.
 *
 * OrangeHRM displays toast notifications after create, update, or delete
 * actions — a green success toast on completion, or a red error toast
 * when an action fails or validation errors occur.
 *
 * Page objects compose this class rather than extending it:
 * @example
 * ```ts
 * this.toast = new Toast(this.page);
 * const message = await this.toast.getSuccessMessage();
 * ```
 */
export class Toast {
  /** Wrapper element that holds all active toasts (used to detect when the UI is clear). */
  private readonly toastContainer: Locator;

  /** The green success toast wrapper (`.oxd-toast--success`). */
  private readonly successToast: Locator;

  /** The red error toast wrapper (`.oxd-toast--error`). */
  private readonly errorToast: Locator;

  /** The text content element inside a toast, shared by both success and error variants. */
  private readonly toastMessage: Locator;

  /**
   * @param page - The Playwright `Page` instance the toast will be observed on.
   */
  constructor(private readonly page: Page) {
    this.toastContainer = this.page.locator(".oxd-toast-container");
    this.successToast = this.page.locator(".oxd-toast--success");
    this.errorToast = this.page.locator(".oxd-toast--error");
    this.toastMessage = this.page.locator(".oxd-toast-content--sub-title");
  }

  /**
   * Waits for a success toast to appear and returns its trimmed message text.
   *
   * Use this immediately after a save, create, or update action to confirm
   * the operation succeeded and to capture the confirmation text for assertions.
   *
   * @returns The trimmed success message, or an empty string if no text is found.
   * @throws {Error} If no success toast becomes visible within `ENV.TIMEOUTS.ACTION`.
   */
  async getSuccessMessage(): Promise<string> {
    await this.successToast.waitFor({ state: "visible", timeout: ENV.TIMEOUTS.ACTION });

    const message = (await this.toastMessage.textContent()) || "";

    log.info("Success Toast: " + message.trim());

    return message.trim();
  }

  /**
   * Waits for an error toast to appear and returns its trimmed message text.
   *
   * Use this after an action that's expected to fail (e.g. validation errors,
   * duplicate records) to capture and assert on the error text.
   *
   * @returns The trimmed error message, or an empty string if no text is found.
   * @throws {Error} If no error toast becomes visible within `ENV.TIMEOUTS.ACTION`.
   */
  async getErrorMessage(): Promise<string> {
    await this.errorToast.waitFor({ state: "visible", timeout: ENV.TIMEOUTS.ACTION });

    const message = (await this.toastMessage.textContent()) || "";

    log.warn("Error Toast: " + message.trim());

    return message.trim();
  }

  /**
   * Checks whether a success toast is currently visible.
   *
   * Returns the current state immediately without waiting — use
   * {@link getSuccessMessage} instead if the toast may not have appeared yet.
   *
   * @returns `true` if the success toast is visible, otherwise `false`.
   */
  isSuccessVisible(): Promise<boolean> {
    return this.successToast.isVisible();
  }

  /**
   * Checks whether an error toast is currently visible.
   *
   * Returns the current state immediately without waiting — use
   * {@link getErrorMessage} instead if the toast may not have appeared yet.
   *
   * @returns `true` if the error toast is visible, otherwise `false`.
   */
  isErrorVisible(): Promise<boolean> {
    return this.errorToast.isVisible();
  }

  /**
   * Waits until all toasts (success or error) have fully disappeared.
   *
   * Multiple toasts can stack inside the same container, so this waits on
   * the container itself rather than an individual toast — ensuring the UI
   * is fully clear before the next interaction (e.g. before clicking a
   * button that might otherwise be covered by a lingering toast).
   *
   * @throws {Error} If the toast container is still visible after `ENV.TIMEOUTS.DEFAULT`.
   */
  async waitForToastToDisappear(): Promise<void> {
    await this.toastContainer.waitFor({ state: "hidden", timeout: ENV.TIMEOUTS.DEFAULT });
  }
}
