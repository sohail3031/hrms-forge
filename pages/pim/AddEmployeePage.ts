import { Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { Toast } from "../../components/Toast";
import { log } from "../../utils/logger";
import { ENV } from "../../config/environment";

export class AddEmployeePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get pageUrl(): string {
    return "/web/index.php/pim/addEmployee";
  }

  private readonly toast = new Toast(this.page);
  private readonly firstNameInput = this.page.locator("input[name='firstName']");
  private readonly middleNameInput = this.page.locator("input[name='middleName']");
  private readonly lastNameInput = this.page.locator("input[name='lastName']");
  private readonly employeeIdInput = this.page.locator(".orangehrm-employee-id input");
  private readonly saveButton = this.page.getByRole("button", { name: "Save" });
  private readonly cancelButton = this.page.getByRole("button", { name: "Cancel" });
  private readonly createLoginToggle = this.page.locator(".oxd-switch-input");
  private readonly usernameInput = this.page.locator("div.user-password-row input").first();
  private readonly passwordInput = this.page.locator("input[type='password']").nth(0);
  private readonly confirmPasswordInput = this.page.locator("input[type='password']").nth(1);
  private readonly statusDropdown = this.page.locator(".oxd-select-wrapper").first();
  private readonly roleDropdown = this.page.locator(".oxd-select-wrapper").nth(1);
  private readonly firstNameError = this.page.locator(".oxd-input-field-error-message").first();
  private readonly lastNameError = this.page.locator(".oxd-input-field-error-message").nth(1);

  async fillFirstName(firstName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName, "First Name");
  }

  async fillMiddleName(middleName: string): Promise<void> {
    await this.fill(this.middleNameInput, middleName, "Middle Name");
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.fill(this.lastNameInput, lastName, "Last Name");
  }

  async fillEmployeeId(employeeId: string): Promise<void> {
    await this.clearField(this.employeeIdInput, "Employee ID");
    await this.fill(this.employeeIdInput, employeeId, "Employee ID");
  }

  async fillRequiredFields(data: {
    firstName: string;
    lastName: string;
    employeeId: string;
    middleName?: string;
  }): Promise<void> {
    log.step(1, "Fill employee required fields");

    await this.fillFirstName(data.firstName);

    if (data.middleName) {
      await this.fillMiddleName(data.middleName);
    }

    await this.fillLastName(data.lastName);
    await this.fillEmployeeId(data.employeeId);
  }

  getGeneratedEmployeeId(): Promise<string> {
    return this.getValue(this.employeeIdInput);
  }

  async clickSave(): Promise<void> {
    await this.click(this.saveButton, "Save");
  }

  async saveAndWaitForProfile(): Promise<void> {
    await this.clickSave();
    await this.page.waitForURL("**/pim/viewPersonalDetails/**", {
      timeout: ENV.TIMEOUTS.NAVIGATION,
    });

    log.info("Navigated to employee profile");
  }

  async saveAndExpectError(): Promise<void> {
    await this.clickSave();
  }

  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton, "Cancel");
  }

  async enableCreateLoginDetails(): Promise<void> {
    await this.click(this.createLoginToggle, "Create login details toggle");
    await this.usernameInput.waitFor({ state: "visible", timeout: ENV.TIMEOUTS.ACTION });
  }

  async fillLoginCredentials(username: string, password: string, role?: string): Promise<void> {
    await this.fill(this.usernameInput, username, "Username");
    await this.fill(this.passwordInput, password, "Password");
    await this.fill(this.confirmPasswordInput, password, "Confirm Password");

    if (role) {
      await this.roleDropdown.selectOption(role);
    }
  }

  async getFirstNameError(): Promise<string> {
    await this.firstNameError.waitFor({ state: "visible" });

    return (await this.firstNameError.textContent()) ?? "";
  }

  async getLastNameError(): Promise<string> {
    await this.lastNameError.waitFor({ state: "visible" });

    return (await this.lastNameError.textContent()) ?? "";
  }

  async isFirstNameErrorVisible(): Promise<boolean> {
    return this.firstNameError.isVisible();
  }

  async isLastNameErrorVisible(): Promise<boolean> {
    return this.lastNameError.isVisible();
  }
}
