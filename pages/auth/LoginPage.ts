import { Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { log } from "../../utils/logger";
import { ENV } from "../../config/environment";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get pageUrl(): string {
    return "/web/index.php/auth/login";
  }

  private readonly usernameInput = this.page.getByPlaceholder("Username");
  private readonly passwordInput = this.page.getByPlaceholder("Password");
  private readonly loginButton = this.page.getByRole("button", { name: "Login" });
  private readonly forgotPasswordLink = this.page.getByText("Forgot your password?");
  private readonly errorMessage = this.page.locator(".oxd-alert-content-text");
  private readonly loginForm = this.page.locator(".orangehrm-login-form");
  private readonly orangehrmLogo = this.page.locator(".orangehrm-login-logo");
  private readonly usernameError = this.page.locator(".oxd-input-field-error-message").first();
  private readonly passwordError = this.page.locator(".oxd-input-field-error-message").first();

  async navigateToLoginPage(): Promise<void> {
    log.info("Navigating to login page");

    await this.navigate();
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username, "Username field");
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password, "Password field");
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton, "Login button");
  }

  async login(username: string, password: string): Promise<void> {
    log.step(1, "Enter username: " + username);

    await this.enterUsername(username);

    log.step(2, "Enter password");

    await this.enterPassword(password);

    log.step(3, "Click Login button");

    await this.clickLoginButton();
  }

  async loginAndWaitForDashboard(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.page.waitForURL("**/dashboard**", { timeout: ENV.TIMEOUTS.NAVIGATION });

    log.info("Dashboard loaded after login");
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);

    return await this.getText(this.errorMessage);
  }

  async getUsernameValidationError(): Promise<string> {
    await this.waitForElement(this.usernameError);

    return await this.getText(this.usernameError);
  }

  async getPasswordValidationError(): Promise<string> {
    await this.waitForElement(this.passwordError);

    return await this.getText(this.passwordError);
  }

  isLoginFormVisible(): Promise<boolean> {
    return this.isVisible(this.loginForm);
  }

  isErrorMessageVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink, "Forgot password link");
  }

  async isPasswordMasked(): Promise<boolean> {
    return await this.passwordInput.getAttribute("type").then(type => type === "password");
  }

  async clearUsernameField(): Promise<void> {
    await this.clearField(this.usernameInput, "Username field");
  }

  async clearPasswordField(): Promise<void> {
    await this.clearField(this.passwordInput, "Password field");
  }
}
