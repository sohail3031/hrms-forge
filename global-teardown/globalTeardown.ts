import { FullConfig } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { log } from "../utils/logger";
import { authenticateAdmin, deleteEmployee, deleteUser } from "../utils/authHelper";

const CLEANUP_FILE = path.join(process.cwd(), "fixtures", "auth", "cleanup.json");

interface CleanupData {
  essEmpNumber: number;
  supervisorEmpNumber: number;
  essUsername: string;
  supervisorUsername: string;
  createdAt: number;
}

async function globalTeardown(_config: FullConfig): Promise<void> {
  console.log("🧹 Global teardown starting...");

  if (!fs.existsSync(CLEANUP_FILE)) {
    log.warn("Nothing to cleanup");
    return;
  }

  let browser;

  try {
    const cleanupData: CleanupData = JSON.parse(fs.readFileSync(CLEANUP_FILE, "utf-8"));
    const auth = await authenticateAdmin();
    browser = auth.browser;
    const { context } = auth;

    await deleteUser(context, cleanupData.essUsername);
    await deleteEmployee(context, cleanupData.essEmpNumber);
    await deleteUser(context, cleanupData.supervisorUsername);
    await deleteEmployee(context, cleanupData.supervisorEmpNumber);

    await context.close();

    fs.unlinkSync(CLEANUP_FILE);

    log.info("Cleanup file removed");
  } catch (error) {
    log.error("Global teardown failed", serializeError(error));
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  console.log("✅ Global teardown complete");
}

// in logger.ts, add a small helper and use it wherever `{ error }` is logged
export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export default globalTeardown;
