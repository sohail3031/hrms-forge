import { FullConfig, chromium, request, BrowserContext, Browser } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";
import { ENV } from "../config/environment";
import { log } from "../utils/logger";

const AUTH_DIR = path.join(process.cwd(), "fixtures", "auth");
const ADMIN_AUTH_FILE = path.join(AUTH_DIR, "admin.json");
const ESS_AUTH_FILE = path.join(AUTH_DIR, "ess-user.json");
const SUPERVISOR_AUTH_FILE = path.join(AUTH_DIR, "supervisor.json");
const TEST_ESS_USER = {
  firstName: "Test",
  lastName: "ESSUser",
  username: "test.ess." + Date.now(),
  password: "Test@1234",
  employeeId: "E" + Date.now().toString().slice(-6),
};
const TEST_SUPERVISOR_USER = {
  firstName: "Test",
  lastName: "Supervisor",
  username: "test.sup." + Date.now(),
  password: "Test@12345",
  employeeId: "S" + Date.now().toString().slice(-6),
};

async function getAdminToken(): Promise<string> {
  const apiContext = await request.newContext({ baseURL: ENV.BASE_URL });

  try {
    const response = await apiContext.post(ENV.ENDPOINTS.LOGIN, {
      data: {
        username: ENV.ADMIN_USERNAME,
        password: ENV.ADMIN_PASSWORD,
      },
    });

    if (!response.ok()) {
      throw new Error("Admin login failed: " + response.status());
    }

    const body = await response.json();

    log.info("Admin token obtained");

    return body.data.token;
  } catch (error) {
    log.error("Get Admin Token Failed: ", { error });
    throw error;
  } finally {
    await apiContext.dispose();
  }
}

async function authenticateAdmin(): Promise<{ context: BrowserContext; browser: Browser }> {
  log.info("Authenticating Admin...");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(ENV.BASE_URL + "/web/index.php/auth/login");
  await page.getByPlaceholder("Username").fill(ENV.ADMIN_USERNAME);
  await page.getByPlaceholder("Password").fill(ENV.ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/dashboard**");
  await context.storageState({ path: ADMIN_AUTH_FILE });

  log.info("Admin auth state saved: " + ADMIN_AUTH_FILE);

  await page.close();

  return { context, browser }; // caller now owns cleanup
}

async function createEmployee(
  context: BrowserContext,
  data: { firstName: string; lastName: string; employeeId: string }
): Promise<number> {
  const response = await context.request.post(
    ENV.BASE_URL + "/web/index.php/api/v2/pim/employees",
    { data: { firstName: data.firstName, lastName: data.lastName, employeeId: data.employeeId } }
  );

  if (!response.ok()) {
    const errorBody = await response.text();
    throw new Error(`Create employee failed: ${response.status()} — ${errorBody}`);
  }

  const body = await response.json();
  log.info("Employee created: " + data.firstName);

  return body.data.empNumber as number;
}

async function createUser(
  context: BrowserContext,
  empNumber: number,
  username: string,
  password: string,
  roleId: number
): Promise<void> {
  const response = await context.request.post(ENV.BASE_URL + "/web/index.php/api/v2/admin/users", {
    data: {
      userRoleId: roleId,
      empNumber: empNumber,
      status: true,
      username: username,
      password: password,
    },
  });

  if (!response.ok()) {
    throw new Error("Create user failed: " + response.status());
  }

  log.info("User created: " + username);
}

async function authenticateUser(
  username: string,
  password: string,
  authFile: string
): Promise<void> {
  log.info("Authenticating: " + username);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(ENV.BASE_URL + "/web/index.php/auth/login");
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("**/dashboard**");
    await context.storageState({ path: authFile });

    log.info("Auth state saved for: " + username);
  } catch (error) {
    log.error("Authenticate User Failed: ", { error });

    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function createAndAuthenticateESSUser(adminContext: BrowserContext): Promise<void> {
  log.info("Setting up ESS user...");

  const empNumber = await createEmployee(adminContext, { ...TEST_ESS_USER });
  await createUser(adminContext, empNumber, TEST_ESS_USER.username, TEST_ESS_USER.password, 2);
  await authenticateUser(TEST_ESS_USER.username, TEST_ESS_USER.password, ESS_AUTH_FILE);

  log.info("ESS user ready");
}

async function createAndAuthenticateSupervisor(adminContext: BrowserContext): Promise<void> {
  log.info("Setting up Supervisor user...");

  const empNumber = await createEmployee(adminContext, {
    firstName: TEST_SUPERVISOR_USER.firstName,
    lastName: TEST_SUPERVISOR_USER.lastName,
    employeeId: TEST_SUPERVISOR_USER.employeeId,
  });

  await createUser(
    adminContext,
    empNumber,
    TEST_SUPERVISOR_USER.username,
    TEST_SUPERVISOR_USER.password,
    2
  );

  await authenticateUser(
    TEST_SUPERVISOR_USER.username,
    TEST_SUPERVISOR_USER.password,
    SUPERVISOR_AUTH_FILE
  );

  log.info("Supervisor user ready");
}

async function globalSetup(config: FullConfig): Promise<void> {
  console.log("🚀 Global setup starting...");

  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  const { context, browser } = await authenticateAdmin();

  try {
    await createAndAuthenticateESSUser(context);
    await createAndAuthenticateSupervisor(context);
  } catch (error) {
    log.error("Global setup failed", { error });
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  console.log("✅ Global setup complete");
}

export default globalSetup;
