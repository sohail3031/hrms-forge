import * as dotenv from "dotenv";
import * as path from "path";

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Environemnt configuration object
export const ENV = {
  // Application URLs
  BASE_URL: process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com",
  API_BASE_URL:
    process.env.API_BASE_URL || "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2",

  // Admin credentials
  ADMIN_USERNAME: process.env.ADMIN_USENAME || "Admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",

  // Test execution settings
  DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT || "30000"),
  HEADLESS: process.env.HEADLESS !== "false",
  WORKERS: parseInt(process.env.WORKERS || "4"),

  // Environment identifier
  ENVIRONMENT: (process.env.ENVIRONMENT || "dev") as "dev" | "ci" | "staging",

  // CI detection
  IS_CI: !!process.env.CI,

  // Auth state file paths
  AUTH: {
    ADMIN: "fixtures/auth/admin.json",
    ESS: "fixtures/auth/ess-user.json",
    SUPERVISOR: "frixtures/auth/supervisor.json",
  },

  // API endpoints
  ENDPOINTS: {
    LOGIN: "/web/index.php/api/v2/auth/login",
    EMPLOYEES: "/web/index.php/api/pim/employees",
    LEAVE: "/web/index.php/api/v2/leave/leaveRequests",
    LEAVVE_TYPES: "/web/index.php/api/v2/leave/leaveTypes",
    USERS: "/web/index.php/api/v2/admin/users",
  },

  // Test data settings
  TEST_DATA: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    FILE_UPLOAD: {
      MAX_SIZE_MB: 1,
      VALID_TYPES: ["image/jpeg", "image/png", "image/gif"],
      INVALID_TYPES: ["application/exe", "application/pdf"],
    },
  },

  // Timeouts
  TIMEOUTS: {
    DEFAULT: parseInt(process.env.DEFAULT_TIMEOUT || "30000"),
    NAVIGATION: 30000,
    ACTION: 10000,
    ASSERTION: 10000,
    API: 10000,
    UPLOAD: 30000,
  },
} as const;

// Validation - fail fast if critical variables are missing
function validateEnvironment(): void {
  const required = ["BASE_URL", "API_BASE_URL", "ADMIN_USERNAME", "ADMIN_PASSWORD"];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\nPlease check your .env file against .env.example`
    );
  }
}

// Run validation when this module si imported
validateEnvironment();

// Type exports
export type Environment = typeof ENV.ENVIRONMENT;
export type Endpoint = keyof typeof ENV.ENVIRONMENT;
