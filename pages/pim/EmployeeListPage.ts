import { Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { Modal } from "../../components/Modal";
import { Toast } from "../../components/Toast";
import { ENV } from "../../config/environment";
import { log } from "../../utils/logger";

export class EmployeeListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private readonly modal = new Modal(this.page);
  private readonly toast = new Toast(this.page);

  get pageUrl(): string {
    return "/web/index.php/pim/viewEmployeeList";
  }

  // Search Form Locator
  private readonly employeeNameInput = this.page.locator("input[placeholder='Type for hints...']");
  private readonly employeeIdInput = this.page
    .locator(".oxd-input-group")
    .filter({ hasText: "Employee Id" })
    .locator("input");
  private readonly employeeStatusDropdown = this.page.locator(".oxd-select-wrapper").nth(0);
  private readonly searchButton = this.page.getByRole("button", { name: "Search" });
  private readonly resetButton = this.page.getByRole("button", { name: "Reset" });
  private readonly addButton = this.page.getByRole("button", { name: "Add" });

  // Table Locator
  private readonly tableBody = this.page.locator(".oxd-table-body");
  private readonly tableRows = this.page.locator(".oxd-table-body .oxd-table-row");
  private readonly noRecordsFound = this.page.getByText("No Records Found");
  private readonly deleteSelectedButton = this.page.getByRole("button", {
    name: "Delete Selected",
  });

  //   Autocomplete Locator
  private readonly autocompleteDropdown = this.page.locator(".oxd-autocomplete-dropdown");
  private readonly autocompleteOptions = this.page.locator(".oxd-autocomplete-option");

  async navigateToEmployeeList(): Promise<void> {
    log.info("Navigating to Employee List");

    await this.navigate();
  }

  async clickAddEmployee(): Promise<void> {
    await this.click(this.addButton, "Add Employee button");
  }

  async searchByName(name: string): Promise<void> {
    log.step(1, "Type name in search: " + name);

    await this.fill(this.employeeNameInput, name, "Employee name search");
    await this.autocompleteDropdown.waitFor({ state: "visible", timeout: ENV.TIMEOUTS.ACTION });
    await this.autocompleteOptions.first().click();
  }

  async searchByEmployeeId(id: string): Promise<void> {
    await this.fill(this.employeeIdInput, id, "Employee ID search");
    await this.clickSearch();
  }

  async clickSearch(): Promise<void> {
    await this.click(this.searchButton, "Search");
    await this.waitForSpinnerToDisappear();
  }

  async clickReset(): Promise<void> {
    await this.click(this.resetButton, "Reset");
    await this.waitForSpinnerToDisappear();
  }

  getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  isNoRecordsFound(): Promise<boolean> {
    return this.noRecordsFound.isVisible();
  }

  async getEmployeeIdInRow(rowIndex: number): Promise<string> {
    const text = await this.tableRows.nth(rowIndex).locator(".oxd-table-cell").nth(1).textContent();

    return text?.trim() ?? "";
  }

  async getFirstNameInRow(rowIndex: number): Promise<string> {
    const text = await this.tableRows.nth(rowIndex).locator(".oxd-table-cell").nth(2).textContent();

    return text?.trim() ?? "";
  }

  async clickEditInRow(rowIndex: number): Promise<void> {
    await this.tableRows.nth(rowIndex).locator("button").nth(0).click();
  }

  async clickDeleteInRow(rowIndex: number): Promise<void> {
    await this.tableRows.nth(rowIndex).locator("button").nth(1).click();
  }

  async selectCheckboxInRow(rowIndex: number): Promise<void> {
    await this.tableRows.nth(rowIndex).locator(".oxd-checkbox-input").click();
  }

  async selectAllCheckboxes(): Promise<void> {
    await this.page
      .locator(".oxd-checkbox-wrapper")
      .nth(1)
      .locator("input[type='checkbox']")
      .click();
  }

  async deleteEmployee(rowIndex: number): Promise<string> {
    await this.selectCheckboxInRow(rowIndex);
    await this.click(this.deleteSelectedButton, "Delete Selected");
    await this.modal.confirm();

    return this.toast.getSuccessMessage();
  }
}
