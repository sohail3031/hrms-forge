/** @type {import("allure-playwright").AllurePlaywrightConfig} */

const config = {
  // Report metadata
  detail: true,
  suiteTitle: true,

  // Output directory
  outputFolder: "allure-results",

  // Categories - Automatically classify failures into meaningful groups
  categories: [
    {
      name: "🐛 Product Bugs",
      messagePatterns: [".*expected.to equal.*", ".*expected.*received.*", ".*AssertionError.*"],
      matchedStatuses: ["failure"],
    },
    {
      name: "⚡ Infrastructure Issues",
      messagePatterns: [
        ".*timeout.*",
        ".*ECNNREFUSED.*",
        ".*net::ERR.*",
        ".*Navigation.*failed.*",
        ".*Target.*closed.*",
      ],
      matchedStatuses: ["failed", "broken"],
    },
    {
      name: "🔄 Flaky Tests",
      messagePatterns: [".*retry.*", ".*flaky.*"],
      matchedStatuses: ["failed"],
    },
    {
      name: "⚠️ Missing Test Data",
      messagePatterns: [".*not found.*", ".*does not exists.*", ".*No records.*", ".*undefined.*"],
      matchedStatuses: ["failed", "broken"],
    },
    {
      name: "🔐 Authentication Issues",
      messagePatterns: [".*401.*", ".*403.*", ".*Unauthorized.*", ".*session.*expired.*"],
      matchedStatuses: ["failed", "broken"],
    },
  ],

  // Environment info
  environmentInfo: {
    App_Name: "OrangeHRM HRMS",
    App_URL: process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com",
    API_URL:
      process.env.API_BASE_URL || "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2",
    Node_Version: process.version,
    Platform: process.platform,
    Environment: process.env.ENVIRONMENT || "dev",
    Framework: "Playwright + TypeScript",
    Reporter: "Allure",
  },
};

module.exports = config;
