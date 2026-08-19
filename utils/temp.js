import * as winston from "winston";
import * as path from "path";
import * as fs from "fs";

const LOG_DIR = path.join(process.cwd(), "logs");

const LOG_FILE = path.join(
  LOG_DIR,
  `test-run-${new Date().toISOString().replace(/[:.]/g, "-")}.log`
);

console.log("Path: " + LOG_FILE);
