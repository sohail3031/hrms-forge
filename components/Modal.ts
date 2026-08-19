import { Locator, Page } from "@playwright/test";
import { ENV } from "../config/environment";
import { log } from "../utils/logger";

/**
 * Handles OrangeHRM's custom confirmation modal (e.g. the "Are you Sure?"
 * delete-confirmation dialog).
 *
 * This is distinct from `BasePage.acceptDialog()` / `BasePage.dismissDialog()`,
 * which handle native browser dialogs (`alert`/`confirm`). This class handles
 * OrangeHRM's own HTML/CSS modal markup instead.
 *
 * Page objects compose this class rather than extending it:
 * @example
 * ```ts
 * this.modal = new Modal(this.page);
 * await this.click(this.deleteButton, "Delete button");
 * await this.modal.confirm();
 * ```
 */
export class Modal {
  /**
   * The modal's footer section, containing the action buttons.
   * Used to detect whether the modal is open, since the footer is the
   * most stable, always-present part of the modal markup.
   */
  private readonly modalContainer: Locator;

  /** The "Yes, Delete" confirmation button. */
  private readonly confirmButton: Locator;

  /** The "No, Cancel" dismissal button. */
  private readonly cancelButton: Locator;

  /** The modal's title text (e.g. "Are you Sure?"). */
  private readonly modalTitle: Locator;

  /**
   * @param page - The Playwright `Page` instance the modal will be observed on.
   */
  constructor(private readonly page: Page) {
    this.modalContainer = this.page.locator(".orangehrm-modal-footer");
    this.confirmButton = this.page.getByRole("button", { name: "Yes, Delete", exact: true });
    this.cancelButton = this.page.getByRole("button", { name: "No, cancel", exact: true });
    this.modalTitle = this.page.locator(".oxd-dialog-title");
  }

  /**
   * Waits for the confirmation modal to appear.
   *
   * Called internally by {@link confirm} and {@link cancel} before clicking
   * any button, so callers don't normally need to call this directly.
   *
   * @throws {Error} If the modal doesn't become visible within `ENV.TIMEOUTS.ACTION`.
   */
  async waitForModal(): Promise<void> {
    await this.modalContainer.waitFor({ state: "visible", timeout: ENV.TIMEOUTS.ACTION });

    log.info("Confirmation Modal Appeared");
  }

  /**
   * Confirms the pending action by clicking "Yes, Delete".
   *
   * Waits for the modal to appear first via {@link waitForModal}.
   *
   * @throws {Error} If the modal never appears (see {@link waitForModal}).
   */
  async confirm(): Promise<void> {
    await this.waitForModal();

    log.action("Modal", "Confirmed");

    await this.confirmButton.click();
  }

  /**
   * Dismisses the pending action by clicking "No, Cancel".
   *
   * Waits for the modal to appear first via {@link waitForModal}.
   *
   * @throws {Error} If the modal never appears (see {@link waitForModal}).
   */
  async cancel(): Promise<void> {
    await this.waitForModal();

    log.action("Modal", "Cancelled");

    await this.cancelButton.click();
  }

  /**
   * Reads the modal's title text (e.g. to assert the correct modal appeared).
   *
   * @returns The modal title text, or an empty string if none is found.
   * @example
   * ```ts
   * expect(await modal.getTitle()).toContain("Are you Sure?");
   * ```
   */
  async getTitle(): Promise<string> {
    await this.modalTitle.waitFor({ state: "visible" });

    return (await this.modalTitle.textContent()) || "";
  }

  /**
   * Checks whether the modal is currently visible.
   *
   * Returns the current state immediately without waiting — use
   * {@link waitForModal} instead if the modal may not have appeared yet.
   *
   * @returns `true` if the modal is visible, otherwise `false`.
   */
  isVisible(): Promise<boolean> {
    return this.modalContainer.isVisible();
  }

  /**
   * Gets a button inside the modal by its accessible name.
   *
   * Generic fallback for modals whose buttons don't match the standard
   * "Yes, Delete" / "No, Cancel" text (OrangeHRM uses different button
   * labels in some contexts, e.g. confirmation for non-delete actions).
   *
   * Returns a `Locator` rather than clicking directly, so the caller can
   * click it, check visibility, wait for it, etc. as needed.
   *
   * @param name - The exact accessible name of the button to locate.
   * @returns A `Locator` for the matching button.
   */
  getButton(name: string): Locator {
    return this.page.getByRole("button", { name });
  }
}
