import * as fs from "fs";
import * as path from "path";

const RESULTS_DIR = path.join(process.cwd(), "allure-results");
const CATEGORIES_SRC = path.join(process.cwd(), "config", "allure-categories.json");
const CATEGORIES_DST = path.join(RESULTS_DIR, "categories.json");
const ENVIRONMENT_DST = path.join(RESULTS_DIR, "environment.properties");

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });

  console.log("✅ Created allure-results directory");
}

// Copy categories config
if (fs.existsSync(CATEGORIES_SRC)) {
  fs.copyFileSync(CATEGORIES_SRC, CATEGORIES_DST);

  console.log("✅ Copied categories.json to allure-results");
}

// Write environment properties
const envProperties = `
App_Name=OrangeHRM HRMS
App_URL=${process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com"}
API_URL=${process.env.API_BASE_URL || "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2"}
Node_Version=${process.version}
Platform=${process.platform}
Environment=${process.env.ENVIRONMENT || "dev"}
Framework=Playwright + TypeScript
Reporter=Allure
`.trim();

fs.writeFileSync(ENVIRONMENT_DST, envProperties);

console.log("✅ Written environment.properties to allure-results");
console.log("\n🚀 Allure setup complete - ready for test run\n");
