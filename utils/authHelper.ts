import { chromium, Browser, BrowserContext } from "@playwright/test";
import { ENV } from "../config/environment";
import { log } from "./logger";

/**
 * Logs in as Admin via the browser and returns an authenticated context.
 * Shared between global setup (creates test users) and global teardown
 * (deletes them), since OrangeHRM's public demo has no working
 * username/password token endpoint — session cookies are the only
 * reliable way to authenticate API calls.
 *
 * @param authFilePath - Optional path to save storageState to (setup only).
 */
export async function authenticateAdmin(
  authFilePath?: string
): Promise<{ context: BrowserContext; browser: Browser }> {
  log.info("Authenticating Admin...");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(ENV.BASE_URL + "/web/index.php/auth/login");
  await page.getByPlaceholder("Username").fill(ENV.ADMIN_USERNAME);
  await page.getByPlaceholder("Password").fill(ENV.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/dashboard**");

  if (authFilePath) {
    await context.storageState({ path: authFilePath });
    log.info("Admin auth state saved: " + authFilePath);
  }

  await page.close();

  return { context, browser };
}

/**
 * Deletes a user account by username. Looks up the user's numeric ID
 * first, then deletes by ID. Logs and returns quietly if the user is
 * already gone rather than throwing.
 */
export async function deleteUser(context: BrowserContext, username: string): Promise<void> {
  const response = await context.request.get(
    `${ENV.BASE_URL}/web/index.php/api/v2/admin/users?limit=50&offset=0&username=${username}&sortField=u.userName&sortOrder=ASC`
  );

  if (!response.ok()) {
    throw new Error("Failed to get the user: " + response.status());
  }

  const body = await response.json();
  const userId = body.data[0]?.id;

  if (!userId) {
    log.warn("User may already be gone: " + username);
    return;
  }

  const deleteResponse = await context.request.delete(
    `${ENV.BASE_URL}/web/index.php/api/v2/admin/users`,
    { data: { ids: [userId] } }
  );

  if (!deleteResponse.ok()) {
    throw new Error("Failed to delete user: " + deleteResponse.status());
  }

  log.info("User deleted: " + username);
}

/**
 * Deletes an employee by their numeric empNumber.
 */
export async function deleteEmployee(context: BrowserContext, empNumber: number): Promise<void> {
  const response = await context.request.delete(
    `${ENV.BASE_URL}/web/index.php/api/v2/pim/employees`,
    { data: { ids: [empNumber] } }
  );

  if (!response.ok()) {
    throw new Error("Failed to delete employee with id: " + empNumber);
  }

  log.info("Employee deleted: " + empNumber);
}
