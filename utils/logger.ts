import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

// Ensures logs directory exists
const LOG_DIR = path.join(process.cwd(), "logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Log file path with timestamp
const LOG_FILE = path.join(
  LOG_DIR,
  `test-run-${new Date().toISOString().replace(/[:.]/g, "-")}.log`
);

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
    const metaStr = Object.keys(metadata).length ? ` | ${JSON.stringify(metadata)}` : "";
    const stackStr = stack ? `\n${stack}` : "";

    return `[${timestamp}] [${level.toUpperCase().padEnd(5)}] ${message}${metaStr}${stackStr}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // Console transport - colored output during test run
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    // File transport - full log for debugging
    new winston.transports.File({
      filename: LOG_FILE,
      format: logFormat,
    }),
  ],
});

// Convenience methods
export const log = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    logger.info(message, meta);
  },
  warn: (message: string, meta?: Record<string, unknown>): void => {
    logger.warn(message, meta);
  },
  error: (message: string, meta?: Record<string, unknown>): void => {
    logger.error(message, meta);
  },
  debug: (message: string, meta?: Record<string, unknown>): void => {
    logger.debug(message, meta);
  },
  step: (stepNumber: number, description: string): void => {
    logger.info(`  STEP ${stepNumber}: ${description}`);
  },
  action: (action: string, element: string): void => {
    logger.info(`  → ${action}: ${element}`);
  },
  assert: (assertion: string): void => {
    logger.info(`  ✓ ASSERT: ${assertion}`);
  },
};

export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }

  return { message: String(error) };
}
