# HRMSForge

> Enterprise-grade QA Automation Framework for OrangeHRM HRMS
> demonstrating mid-to-senior SDET engineering standards

[![Smoke Tests](https://github.com/sohail3031/hrms-forge/actions/workflows/smoke.yml/badge.svg)](https://github.com/sohail3031/hrms-forge/actions/workflows/smoke.yml)
[![Regression](https://github.com/sohail3031/hrms-forge/actions/workflows/regression.yml/badge.svg)](https://github.com/sohail3031/hrms-forge/actions/workflows/regression.yml)
[![Playwright](https://img.shields.io/badge/Playwright-1.40+-green)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-20.x_LTS-green)](https://nodejs.org)
[![ESLint](https://img.shields.io/badge/ESLint-8.x-purple)](https://eslint.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Application Under Test](#application-under-test)
- [Tech Stack](#tech-stack)
- [Framework Architecture](#framework-architecture)
- [Test Coverage](#test-coverage)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [Documentation](#documentation)
- [Author](#author)

---

## Overview

HRMSForge is a production-grade, enterprise-level test automation
framework built for the OrangeHRM Human Resource Management System.

Built to demonstrate real-world SDET skills across five testing
dimensions:

| Dimension         | Tool                         | Coverage                  |
| ----------------- | ---------------------------- | ------------------------- |
| UI Automation     | Playwright + TypeScript      | Cross-browser, multi-role |
| API Testing       | Playwright APIRequestContext | REST contract validation  |
| Accessibility     | @axe-core/playwright         | WCAG 2.1 AA compliance    |
| Performance       | k6 (Grafana)                 | Load, stress, spike, soak |
| Visual Regression | Playwright Screenshots       | Baseline comparison       |

**Key engineering decisions:**

- Page Object Model with reusable component abstractions
- Multi-role authentication via Playwright storageState
- Hybrid API+UI integration testing pattern
- Test isolation with faker-generated unique data
- Allure reporting published to GitHub Pages
- Full CI/CD pipeline with 4 GitHub Actions workflows

---

## Application Under Test

| Property    | Details                                      |
| ----------- | -------------------------------------------- |
| Application | OrangeHRM — Human Resource Management System |
| URL         | https://opensource-demo.orangehrmlive.com    |
| Type        | Enterprise SaaS — HR & People Management     |
| Frontend    | Vue.js SPA                                   |
| Backend     | PHP (Symfony)                                |
| API         | REST API v2 with Swagger                     |
| Auth        | Session-based + JWT                          |

### Test Accounts

| Role          | Username                 | Access             |
| ------------- | ------------------------ | ------------------ |
| Administrator | Admin                    | Full system access |
| ESS Employee  | Created via global setup | Self-service only  |
| Supervisor    | Created via global setup | Team management    |

---

## Tech Stack

| Layer           | Tool                         | Version   | Purpose                  |
| --------------- | ---------------------------- | --------- | ------------------------ |
| Language        | TypeScript                   | 5.x       | Type-safe development    |
| UI Automation   | Playwright                   | 1.40+     | Cross-browser automation |
| API Testing     | Playwright APIRequestContext | Built-in  | REST API validation      |
| Accessibility   | @axe-core/playwright         | Latest    | WCAG 2.1 AA testing      |
| Performance     | k6                           | Latest    | Load and stress testing  |
| Data Generation | @faker-js/faker              | Latest    | Dynamic test data        |
| Reporting       | Allure Report                | 2.x       | Stakeholder dashboards   |
| CI/CD           | GitHub Actions               | —         | Automated pipeline       |
| Containers      | Docker                       | —         | Consistent execution     |
| Code Quality    | ESLint + Prettier            | 8.x / 3.x | Linting and formatting   |
| Git Hooks       | Husky + commitlint           | Latest    | Pre-commit quality gates |
| Node.js         | Node.js LTS                  | 20.x      | Runtime                  |

---

## Framework Architecture

```
hrms-forge/
│
├── tests/                    # Test specifications
│   ├── ui/                   # UI automation tests (by module)
│   │   ├── auth/             # Authentication tests
│   │   ├── pim/              # Employee management tests
│   │   ├── leave/            # Leave management tests
│   │   ├── admin/            # Admin module tests
│   │   ├── dashboard/        # Dashboard tests
│   │   └── directory/        # Directory tests
│   ├── api/                  # REST API tests
│   ├── integration/          # Hybrid API+UI tests
│   ├── accessibility/        # axe-core WCAG tests
│   ├── visual/               # Screenshot regression tests
│   └── performance/k6/       # k6 performance scripts
│
├── pages/                    # Page Object Model
│   ├── base/                 # BasePage (inherited by all)
│   ├── auth/                 # LoginPage
│   ├── pim/                  # Employee pages
│   ├── leave/                # Leave pages
│   ├── admin/                # Admin pages
│   ├── dashboard/            # Dashboard page
│   └── directory/            # Directory page
│
├── components/               # Reusable UI components
│   (DataTable, Modal, Navigation, Toast, DatePicker)
│
├── fixtures/                 # Playwright fixtures + auth state
├── api/                      # API client layer
│   ├── clients/              # Per-service API clients
│   └── schemas/              # JSON schema validation
│
├── helpers/                  # Business-level test helpers
├── utils/                    # Low-level utilities
├── config/                   # Environment config + tags
├── data/                     # Test data (JSON)
├── global-setup/             # Pre-suite auth setup
├── global-teardown/          # Post-suite cleanup
├── docker/                   # Docker configuration
└── scripts/                  # Utility scripts
```

### Authentication Strategy

```
Global Setup runs ONCE before all tests:
  1. Login as Admin via API
  2. Save browser context → fixtures/auth/admin.json
  3. Login as ESS user via API
  4. Save browser context → fixtures/auth/ess-user.json
  5. Login as Supervisor via API
  6. Save browser context → fixtures/auth/supervisor.json

Each test project pre-loads the correct auth state.
Tests start already authenticated — no login per test.
Saves ~2 seconds per test × 147 tests = ~5 minutes saved per run.
```

---

## Test Coverage

| Module              | UI     | API    | Integration | A11y  | Visual | Total   |
| ------------------- | ------ | ------ | ----------- | ----- | ------ | ------- |
| Authentication      | 20     | 3      | 2           | 2     | 1      | 28      |
| Employee Management | 30     | 8      | 3           | 2     | 2      | 45      |
| Leave Management    | 20     | 5      | 2           | 1     | 0      | 28      |
| Admin Module        | 12     | 4      | 1           | 1     | 0      | 18      |
| Dashboard           | 5      | 0      | 0           | 1     | 1      | 7       |
| Directory           | 5      | 0      | 0           | 1     | 1      | 7       |
| Performance (k6)    | —      | —      | —           | —     | —      | 10      |
| **Total**           | **92** | **20** | **8**       | **8** | **5**  | **143** |

### Test Status

| Phase | Module                 | Status             |
| ----- | ---------------------- | ------------------ |
| ✅    | Infrastructure + CI/CD | Complete           |
| 🔄    | Framework Foundation   | In Progress        |
| 🔲    | Authentication Tests   | Planned — Sprint 1 |
| 🔲    | PIM Tests              | Planned — Sprint 1 |
| 🔲    | API Tests              | Planned — Sprint 2 |
| 🔲    | Leave Management       | Planned — Sprint 2 |
| 🔲    | Admin Tests            | Planned — Sprint 3 |
| 🔲    | Accessibility Tests    | Planned — Sprint 3 |
| 🔲    | Performance Tests      | Planned — Sprint 3 |

---

## Quick Start

### Prerequisites

```bash
# Required
Node.js 20 LTS    https://nodejs.org
Git               https://git-scm.com
Docker Desktop    https://www.docker.com/products/docker-desktop (optional)
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sohail3031/hrms-forge.git
cd hrms-forge

# 2. Install dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install

# 4. Configure environment
cp .env.example .env
# Open .env and add your credentials

# 5. Verify setup
npm run verify:env

# 6. Run smoke tests to confirm everything works
npm run test:smoke
```

### Expected Output After Setup

```
Running 2 tests using 1 worker

  ✓  [chromium] › tests/ui/auth/loginPage.smoke.spec.ts
       application is accessible and login page loads
  ✓  [chromium] › tests/ui/auth/loginPage.smoke.spec.ts
       login page URL is correct

  2 passed (4.5s)
```

---

## Running Tests

### By Test Type

```bash
npm run test:smoke          # Smoke tests only (< 3 min)
npm run test:regression     # Full regression suite
npm run test:api            # API tests only
npm run test:accessibility  # Accessibility tests (axe-core)
npm run test:visual         # Visual regression tests
```

### By Browser

```bash
npm run test:chromium       # Chromium (primary)
npm run test:firefox        # Firefox
npm run test:webkit         # WebKit (Safari engine)
npm run test:mobile         # Mobile Chrome (Pixel 5 viewport)
```

### Development Modes

```bash
npm run test:headed         # Show browser during test run
npm run test:debug          # Pause on each step (debugging)
npm run test:ui             # Playwright UI mode (visual test runner)
```

### Run Specific Test File

```bash
npx playwright test tests/ui/auth/loginPage.smoke.spec.ts
```

### Run by Tag

```bash
npx playwright test --grep @smoke
npx playwright test --grep @auth
npx playwright test --grep @critical
```

---

## Reporting

### Allure Report (Recommended)

```bash
# Generate and open Allure report
npm run report

# Or separately:
npm run allure:generate     # Generate HTML from results
npm run allure:open         # Open in browser
npm run allure:serve        # Serve live from results
```

### Playwright HTML Report

```bash
npm run report:playwright
```

### Live Allure Report

📊 [View Latest Report](https://sohail3031.github.io/hrms-forge/)

> Auto-published after every nightly run

---

## CI/CD Pipeline

| Workflow              | Trigger          | Scope                 | Duration |
| --------------------- | ---------------- | --------------------- | -------- |
| 🚀 Smoke Tests        | Every push       | @smoke — Chromium     | < 3 min  |
| ✅ PR Quality Check   | Every PR to main | Lint + TypeCheck      | < 2 min  |
| 🔄 Regression Suite   | PR to main       | Full suite — Chromium | < 20 min |
| 🌙 Nightly Full Suite | 2 AM EST daily   | Cross-browser + A11y  | < 45 min |
| 📊 Allure Report      | After nightly    | Publish to Pages      | < 5 min  |

### Pipeline Architecture

```
Every Push:
  Smoke Tests (Chromium) → Pass/Fail in < 3 min

Every PR to main:
  PR Quality Check (lint + types) → gate
  Regression Suite (Chromium) → gate
  Both must pass before merge allowed

Nightly 2 AM:
  Chromium Tests ─┐
  Firefox Tests   ├─ Matrix (parallel)
  WebKit Tests   ─┘
  Accessibility Tests (Chromium + axe)
  → Results published to Allure GitHub Pages
```

### Secrets Required

| Secret         | Description            |
| -------------- | ---------------------- |
| BASE_URL       | Application base URL   |
| API_BASE_URL   | REST API base URL      |
| ADMIN_USERNAME | Admin account username |
| ADMIN_PASSWORD | Admin account password |

---

## Docker

```bash
# Build the test runner image
npm run docker:build

# Run specific suites in Docker
npm run docker:smoke        # Smoke tests
npm run docker:regression   # Regression suite
npm run docker:api          # API tests

# Clean up
npm run docker:clean
```

### Why Docker

Tests run in an isolated container with pinned browser versions,
eliminating environment differences between machines and CI runners.

---

## Code Quality

```bash
npm run lint                # ESLint check
npm run lint:fix            # Auto-fix ESLint issues
npm run format              # Prettier format
npm run format:check        # Check formatting
npm run type-check          # TypeScript compilation check
npm run verify:env          # Verify environment setup
npm run clean               # Clean generated outputs
```

### Standards Enforced

```
ESLint rules:
  ✅ playwright/no-focused-test      (no test.only in commits)
  ✅ playwright/no-wait-for-timeout  (no hard waits)
  ✅ playwright/prefer-web-first-assertions
  ✅ @typescript-eslint/no-floating-promises

Pre-commit hooks (Husky):
  ✅ lint-staged   (ESLint + Prettier on staged files)
  ✅ tsc --noEmit  (TypeScript type check)
  ✅ commitlint    (conventional commits enforced)

Commit format: type(scope): description
Examples:
  feat(auth): add valid login test
  fix(pim): correct employee search locator
  chore: upgrade playwright to 1.41.0
```

---

## Documentation

All project documentation lives in `/docs`:

| Document         | Description                             |
| ---------------- | --------------------------------------- |
| BRD.md           | Business Requirements Document          |
| SRS.md           | Software Requirements Specification     |
| TEST_STRATEGY.md | Test strategy and approach              |
| TEST_CASES.xlsx  | 150+ manual test cases                  |
| BUG_REPORTS.md   | 25 bug reports with reproduction steps  |
| ARCHITECTURE.md  | Framework architecture decisions        |
| SPRINT_NOTES/    | Sprint planning and retrospective notes |

---

## Author

**Sohail Ahmed Mohammed**

QA Automation Engineer | SDET | ISTQB CT-TAE

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://linkedin.com/in/mohammed-sohail-ahmed-a47a87196)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?logo=github)](https://github.com/sohail3031)
[![Portfolio](https://img.shields.io/badge/Portfolio-View-green)](https://sohail3031.github.io/sohail-ahmed-portfolio/)

---

_Built as an enterprise portfolio project demonstrating
mid-to-senior SDET skills in QA automation engineering._

_Framework: Playwright + TypeScript | Reporting: Allure |
CI/CD: GitHub Actions | Performance: k6 | Accessibility: axe-core_
