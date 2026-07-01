/**
 * Test tag constants for consistent tagging across the framework.
 * Use these constants instead of raw strings to prevent typos.
 *
 * Usage in tests:
 *   test(`login test @smoke`, ...)
 *   OR
 *   test.describe(`@smoke @critical`, ...)
 */

export const Tags = {
  // Execution tiers
  SMOKE: "@smoke",
  REGRESSION: "@regression",
  SANITY: "@sanity",

  // Priority
  CRITICAL: "@critical",
  HIGH: "@high",
  MEDIUM: "@medium",
  LOW: "@low",

  // Test types
  API: "@api",
  INTEGRATION: "@integration",
  ACCESSIBILITY: "@accessibility",
  VISUAL: "@visual",
  PERFORMANCE: "@performance",
  SECURITY: "@security",
  CROSSBROWSER: "@crossbrowser",
  MOBILE: "@mobile",

  // Modules
  AUTH: "@auth",
  PIM: "@pim",
  LEAVE: "@leave",
  ADMIN: "@admin",
  DASHBOARD: "@dashboard",
  DIRECTORY: "@directory",

  // Special states
  FLAKY: "@flaky",
  WIP: "@wip",
  SKIP: "@skip",
} as const;
