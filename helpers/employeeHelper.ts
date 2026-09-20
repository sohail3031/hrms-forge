import { Page } from "@playwright/test";
import { EmployeeListPage } from "../pages/pim/EmployeeListPage";
import { AddEmployeePage } from "../pages/pim/AddEmployeePage";
import { EmployeeProfilePage } from "../pages/pim/EmployeeProfilePage";
import { TestDataFactory, type EmployeeData } from "./testDataFactory";
import { log } from "../utils/logger";

export class EmployeeHelper {
  private readonly page: Page;
  private readonly listPage: EmployeeListPage;
  private readonly addPage: AddEmployeePage;
  private readonly profilePage: EmployeeProfilePage;

  constructor(page: Page) {
    this.page = page;
    this.listPage = new EmployeeListPage(page);
    this.addPage = new AddEmployeePage(page);
    this.profilePage = new EmployeeProfilePage(page);
  }

  async createEmployee(overrides?: Partial<EmployeeData>): Promise<EmployeeData> {
    const data = { ...TestDataFactory.employee(), ...overrides };

    log.info("Creating employee: " + data.fullName);

    await this.listPage.navigateToEmployeeList();
    await this.listPage.clickAddEmployee();
    await this.addPage.fillRequiredFields(data);
    await this.addPage.saveAndWaitForProfile();

    log.info("Employee created: " + data.fullName);

    return data;
  }

  async searchAndVerifyEmployee(searchTerm: string, searchType: "name" | "id"): Promise<boolean> {
    await this.listPage.navigateToEmployeeList();

    if (searchType === "name") {
      await this.listPage.searchByName(searchTerm);
    } else {
      await this.listPage.searchByEmployeeId(searchTerm);
    }

    return !(await this.listPage.isNoRecordsFound());
  }

  async deleteEmployeeByIndex(index: number): Promise<void> {
    await this.listPage.navigateToEmployeeList();

    const message = await this.listPage.deleteEmployee(index);

    log.info("Employee deleted: " + message);
  }
}
