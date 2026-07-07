import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Environment variable helpers
const BASE_URL = process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com";
const API_BASE_URL =
  process.env.API_BASE_URL || "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2";
const HEADLESS = process.env.HEADLESS !== "false";
const WORKERS = process.env.WORKERS ? parseInt(process.env.WORKERS) : 4;
const TIMEOUT = process.env.DEFAULT_TIME ? parseInt(process.env.DEFAULT_TIME) : 30000;
const IS_CI = !!process.env.CI;

// Auth state paths
const AUTH_DIR = path.join(__dirname, "fixtures", "auth");
const ADMIN_AUTH = path.join(AUTH_DIR, "admin.json");
const ESS_AUTH = path.join(AUTH_DIR, "ess-user.json");
const SUPERVISOR_AUTH = path.join(AUTH_DIR, "supervisor.json");

// Only use storageState if the file exists
// Before global setup runs, these  files do not exist yet
const adminAuth = fs.existsSync(ADMIN_AUTH) ? ADMIN_AUTH : undefined;
const essAuth = fs.existsSync(ESS_AUTH) ? ESS_AUTH : undefined;
const supervisorAuth = fs.existsSync(SUPERVISOR_AUTH) ? SUPERVISOR_AUTH : undefined;

// Export config
export default defineConfig({
  // Test discovery
  testDir: "./tests",
  testMatch: "**/*.spec.ts",

  // Global timeout settings
  timeout: TIMEOUT,
  expect: {
    timeout: 10000, // assertion auto-retry timeout
  },

  // Execution settings
  fullyParallel: true,
  forbidOnly: IS_CI, // fail CI if test.only is committed
  retries: IS_CI ? 2 : 0, // retry on CI only
  workers: IS_CI ? 2 : WORKERS,

  // Global setup and teardown
  globalSetup: "./global-setup/globalSetup.ts",
  globalTeardown: "./global-teardown/globalTeardown.ts",

  // Reporters
  reporter: [
    // Console output during run
    ["list"],
    // Playwright HTML report
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],
    // Allure report
    [
      "allure-playwright",
      {
        detail: true,
        outputFolder: "allure-results",
        suiteTitle: true,
        categories: [
          {
            name: "🐛 Product Bugs",
            messagePatterns: [".*expected.*received.*", ".*AssertionError.*"],
            matchedStatuses: ["failed"],
          },
          {
            name: "⚡ Infrastructure Issues",
            messagePatterns: [".*timeout.*", ".*ECONNREFUSED.*", ".*net::ERR.*"],
            matchedStatuses: ["failed", "broken"],
          },
          {
            name: "🔄 Flaky Tests",
            messagePatterns: [".*retry.*"],
            matchedStatuses: ["failed"],
          },
          {
            name: "⚠️ Missing Test Data",
            messagePatterns: [".*not found.*", ".*does not exists.*"],
            matchedStatuses: ["failed", "broken"],
          },
          {
            name: "🔐 Authentication Issues",
            messagePatterns: [".*401.*", ".*403.*", ".*Unauthorized.*"],
            matchedStatuses: ["failed", "broken"],
          },
        ],
        environmentInfo: {
          App_Name: "OrangeHRM HRMS",
          App_URL: BASE_URL,
          API_URL: API_BASE_URL,
          Node_Version: process.version,
          Platform: process.platform,
          Environment: process.env.ENVIRONMENT || "dev",
          Headless: String(HEADLESS),
          Framework: "Playwright + TypeScript",
        },
      },
    ],
    // GitHub Actions annotations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(IS_CI ? [["github"] as any] : []),
    // JUnit XML
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(IS_CI ? [["junit", { outputFile: "test-results/junit-results.xml" }]] : []),
  ],

  // Shared settings for all tests
  use: {
    // URLs
    baseURL: BASE_URL,

    // Browser
    headless: HEADLESS,
    viewport: { width: 1280, height: 720 },
    locale: "en-US",

    // Canadian timezone
    timezoneId: "America/Toronto",

    // On failure - capture everything for debugging
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",

    // Timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Extra HTTP headers for all requests
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
    },

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Output folder
  outputDir: "test-results",

  // Browser projects
  projects: [
    // Chromium (primary - all tests run here)
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: adminAuth,
        launchOptions: {
          args: [
            "--disable-web-security",
            "--disable-features=IsolateOrigins",
            "--disable-site-isolation-trials",
          ],
        },
      },
    },
    // firefox (smoke + cross-browser)
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: adminAuth,
      },
      grep: /@smoke|@crossbrowser/,
    },
    // Webkit - Safari engine (smoke + critical path only)
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: adminAuth,
      },
      grep: /@smoke|@crossbrowser/,
    },
    //  API tests projet (no browser needed)
    {
      name: "api",
      testMatch: "**/tests/api/**/*.spec.ts",
      use: {
        baseURL: BASE_URL,
        extraHTTPHeaders: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    },
    // Accessibility tests project
    {
      name: "accessibility",
      testMatch: "**/tests/accessibility/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: adminAuth,
      },
    },
    //  Visual regression project
    {
      name: "visual",
      testMatch: "**/tests/visual/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: adminAuth,
        // Consistent viewport for visual comparisons
        viewport: { width: 1200, height: 720 },
      },
    },
    // ESS user project (leave + self-service tests)
    {
      name: "ess",
      testMatch: "**/tests/ui/leave/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: essAuth,
      },
      grep: /@ess/,
    },
    // Supervisor peroject (approval workflow tests)
    {
      name: "supervisor",
      testMatch: "**/*tests/ui/leave/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: supervisorAuth,
      },
      grep: /@supervisor/,
    },
    // Mobile Chrome viewport (reponsive testing)
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        storageState: adminAuth,
      },
      grep: /@mobile/,
    },
  ],
});
