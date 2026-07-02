/**
 * Run this script to verify your environment configuration is correct.
 * Usage: npx ts-node scripts/verify-env.ts
 */
import { ENV } from "../config/environment";

console.log("\n🔍 Environment Configuration Verification\n");
console.log("─".repeat(50));
console.log(`Environment: ${ENV.ENVIRONMENT}`);
console.log(`Base URL: ${ENV.BASE_URL}`);
console.log(`API Base URL: ${ENV.API_BASE_URL}`);
console.log(`Admin User: ${ENV.ADMIN_USERNAME}`);
console.log(`Admin Password: ${"*".repeat(ENV.ADMIN_PASSWORD.length)}`);
console.log(`Headless: ${ENV.HEADLESS}`);
console.log(`Workers: ${ENV.WORKERS}`);
console.log(`Timeout: ${ENV.DEFAULT_TIMEOUT}`);
console.log(`IS CI: ${ENV.IS_CI}`);
console.log("─".repeat(50));
console.log("\n✅ Environment configuration loaded successfully\n");
