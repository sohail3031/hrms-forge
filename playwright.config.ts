import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Environment helpers
const BASE_URL =
  process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com";
const HEADLESS = process.env.HEADLESS !== "false";
const WORKERS = process.env.WORKERS ? parseInt(process.env.WORKERS) : 4;
const TIMEOUT = process.env.DEFAULT_TIME
  ? parseInt(process.env.DEFAULT_TIME)
  : 30000;
const IS_CI = !!process.env.CI;

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
    ["list"], // console output during run
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],
    [
      "allure-playwright",
      {
        detail: true,
        outputFolder: "allure-results",
        suiteTitle: true,
        environmentInfo: {
          App_URL: BASE_URL,
          Node_Version: process.version,
          Platform: process.platform,
        },
      },
    ],
    ...(IS_CI ? [["github"] as any] : []), // GitHub annotations in CI
  ],

  // Shared settings for all tests
  use: {
    baseURL: BASE_URL,
    headless: HEADLESS,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
    locale: "en-US",
    timezoneId: "America/Toronto",
  },

  // Output folers
  outputDir: "test-results",

  // Browser projects
  projects: [
    // // Setup project (runs before all test projects)
    // {
    //   name: "setup",
    //   testMatch: "**/global-setup/**/*.ts",
    // },
    // // Cleanup project (runs after all test projects)
    // {
    //   name: "cleaup",
    //   testMatch: "**/global-teardown/**/*.ts",
    // },
    // Chromium (primary - all tests run here)
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "fixtures/auth/admin.json",
      },
      // dependencies: ["setup"],
    },
    // firefox (smoke + critical path only)
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "fixtures/auth/admin.json",
      },
    },
    // Webkit - Safari engine (smoke + critical path only)
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: "fixtures/auth/admin.json",
      },
    },
    //  API tests projet (no browser needed)
    {
      name: "api",
      testMatch: "**/tests/api/**/*.spec.ts",
      use: {
        baseURL: BASE_URL,
      },
    },
    // Accessibility tests project
    {
      name: "accessibility",
      testMatch: "**/tests/accessibility/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "fixtures/auth/admin.json",
      },
      // dependencies: ["setup"],
    },
    //  Visual regression project
    {
      name: "visual",
      testMatch: "**/tests/visual/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "fixtures/auth/admin.json",
      },
      // dependencies: ["setup"],
    },
    // Mobile Chrome viewport (reponsive testing)
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        storageState: "fixtures/auth/admin.json",
      },
      // dependencies: ["setup"],
      grep: /@mobile/,
    },
  ],
});
