import { Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { Toast } from "../../components/Toast";
import { log } from "../../utils/logger";

export class EmployeeProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get pageUrl(): string {
    return "/web/index.php/pim/viewPersonalDetails";
  }

  private readonly toast = new Toast(this.page);
  private readonly personalDetails = this.page.getByText("Personal Details");
  private readonly contactDetails = this.page.getByText("Contact Details");
  private readonly emergencyContacts = this.page.getByText("Emergency Contacts");
  private readonly jobs = this.page.getByText("Job");
  private readonly firstNameInput = this.page.locator("input[name='firstName']");
  private readonly middleNameInput = this.page.locator("input[name='middleName']");
  private readonly lastNameInput = this.page.locator("input[name='lastName']");
  private readonly saveButton = this.page.getByRole("button", { name: "Save" }).first();
  private readonly employeeNameHeading = this.page.locator(".orangehrm-edit-employee-name h6");
  private readonly profilePhotoArea = this.page.locator(".employee-image-wrapper");
  private readonly fileInput = this.page.locator("input[type='file']");

  async clickPersonalDetailsTab(): Promise<void> {
    await this.personalDetails.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickContactDetailsTab(): Promise<void> {
    await this.contactDetails.click();
  }

  async clickEmergencyContactsTab(): Promise<void> {
    await this.emergencyContacts.click();
  }

  async clickJobTab(): Promise<void> {
    await this.jobs.click();
  }

  async updateFirstName(firstName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName, "First Name");
  }

  async updateLastName(lastName: string): Promise<void> {
    await this.fill(this.lastNameInput, lastName, "Last Name");
  }

  async savePersonalDetails(): Promise<string> {
    await this.click(this.saveButton, "Save");

    return await this.toast.getSuccessMessage();
  }

  async getDisplayedEmployeeName(): Promise<string> {
    await this.waitForElement(this.employeeNameHeading);

    return await this.getText(this.employeeNameHeading);
  }

  async getFirstNameValue(): Promise<string> {
    return await this.getValue(this.firstNameInput);
  }

  async getLastNameValue(): Promise<string> {
    return await this.getValue(this.lastNameInput);
  }

  getEmpNumberFromUrl(): string {
    const url = this.getCurrentUrl();
    const parts = url.split("/empNumber/");

    if (parts[1]) {
      return parts[1].split("/")[0];
    }

    return "";
  }

  async uploadProfilePhoto(filePath: string): Promise<string> {
    log.info("Uploading profile photo: " + filePath);

    await this.fileInput.setInputFiles(filePath);
    await this.saveButton.click();

    return await this.toast.getSuccessMessage();
  }
}
