# HRMSForge

> Enterprise-grade QA Automation Framework for OrangeHRM HRMS

<!-- ![CI](https://github.com/sohail3031/hrms-forge/actions/workflows/smoke.yaml/badge.svg) -->

![Playwright](https://img.shields.io/badge/Playwright-1.40+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node](https://img.shields.io/badge/Node-20.x_LTS-green)
![License](https://img.shields.io/badge/license-MIT-green)
![ESLint](https://img.shields.io/badge/ESLint-8.x-purple)
[![Smoke Tests](https://github.com/sohail3031/hrms-forge/actions/workflows/smoke.yml/badge.svg)](https://github.com/sohail3031/hrms-forge/actions/workflows/smoke.yml)
[![Regression](https://github.com/sohail3031/hrms-forge/actions/workflows/regression.yml/badge.svg)](https://github.com/sohail3031/hrms-forge/actions/workflows/regression.yml)

## Overview

HRMSForge is a production-grade, enterprise-level QA automation framework
built for the OrangeHRM Human Resource Management System. It demonstrates
mid-to-senior SDET skills across multiple testing dimensions.

## Application Under Test

| Property    | Details                                      |
| ----------- | -------------------------------------------- |
| Application | OrangeHRM — Human Resource Management System |
| URL         | https://opensource-demo.orangehrmlive.com    |
| Type        | Enterprise SaaS — HR & People Management     |
| API         | REST API v2 with Swagger documentation       |

## Tech Stack

| Layer            | Tool                         | Purpose                           |
| ---------------- | ---------------------------- | --------------------------------- |
| Language         | TypeScript 5.x               | Type-safe test development        |
| UI Automation    | Playwright 1.40+             | Cross-browser automation          |
| API Testing      | Playwright APIRequestContext | REST API validation               |
| Accessibility    | @axe-core/playwright         | WCAG 2.1 AA compliance            |
| Performance      | k6 (Grafana)                 | Load, stress, spike, soak testing |
| Reporting        | Allure Report                | Stakeholder test reporting        |
| CI/CD            | GitHub Actions               | Automated pipeline                |
| Containerization | Docker                       | Consistent execution environment  |
| Code Quality     | ESLint + Prettier            | Linting and formatting            |
| Git Hooks        | Husky + commitlint           | Pre-commit quality gates          |

## Test Coverage (Planned)

| Module                    | Tests   | Type          | Status     |
| ------------------------- | ------- | ------------- | ---------- |
| Authentication            | 20      | UI + Security | 🔲 Planned |
| Employee Management (PIM) | 30      | UI + API      | 🔲 Planned |
| Leave Management          | 20      | UI + API      | 🔲 Planned |
| Admin Module              | 12      | UI            | 🔲 Planned |
| Dashboard                 | 5       | UI            | 🔲 Planned |
| Directory                 | 5       | UI            | 🔲 Planned |
| API Tests                 | 20      | API           | 🔲 Planned |
| Integration Tests         | 8       | Hybrid        | 🔲 Planned |
| Accessibility Tests       | 12      | axe-core      | 🔲 Planned |
| Visual Regression         | 5       | Screenshot    | 🔲 Planned |
| Performance (k6)          | 10      | Load/Stress   | 🔲 Planned |
| **Total**                 | **147** |               |            |

## Framework Architecture

```test
hrms-forge/
├── tests/          # Test specs (ui, api, integration, accessibility, visual, performance)
├── pages/          # Page Object Model (one class per page)
├── components/     # Reusable UI components (table, modal, navigation)
├── fixtures/       # Playwright fixtures and auth state
├── api/            # API client layer
├── helpers/        # Business-level test helpers
├── utils/          # Low-level utilities
├── config/         # Environment config and test tags
├── data/           # Test data (JSON)
├── global-setup/   # Pre-suite authentication setup
├── global-teardown/# Post-suite cleanup
├── docker/         # Docker configuration
└── scripts/        # Utility scripts
```

## Quick Start

### Prerequisites

```bash
Node.js 20 LTS
npm 10+
```

### Installation

```bash
# Clone the repository
git clone https://github.com/sohail3031/hrms-forge.git
cd hrms-forge

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Running Tests

```bash
# Smoke tests (fast — under 3 minutes)
npm run test:smoke

# Full regression suite
npm run test:regression

# API tests only
npm run test:api

# Specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# With UI (headed mode — see the browser)
npm run test:headed

# Debug mode
npm run test:debug
```

### Reporting

```bash
# Generate and open Allure report
npm run report

# Open Playwright HTML report
npm run report:playwright
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check

# Verify environment setup
npm run verify:env
```

## CI/CD Pipeline

| Trigger              | Suite                       | Duration |
| -------------------- | --------------------------- | -------- |
| Every push           | Smoke tests                 | < 3 min  |
| Pull request to main | Full regression             | < 20 min |
| Nightly 2AM          | Cross-browser + Performance | < 45 min |

## Project Status

| Phase   | Description          | Status         |
| ------- | -------------------- | -------------- |
| Phase 1 | Infrastructure Setup | ✅ Complete    |
| Phase 2 | CI/CD Pipeline       | 🔄 In Progress |
| Phase 3 | Documentation        | 🔲 Planned     |
| Phase 4 | Jira Setup           | ✅ Complete    |
| Phase 5 | Framework Foundation | 🔲 Planned     |
| Phase 6 | Authentication Tests | 🔲 Planned     |
| Phase 7 | PIM Tests            | 🔲 Planned     |
| Phase 8 | API Tests            | 🔲 Planned     |

## Documentation

All project documentation lives in `/docs`:

- Business Requirements Document (BRD)
- Software Requirements Specification (SRS)
- Test Strategy
- Manual Test Cases (150+)
- Bug Reports (25)

## Author

**Sohail Ahmed Mohammed** — QA Automation Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/mohammed-sohail-ahmed-a47a87196)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-yellow)](https://github.com/sohail3031)
[![Portfolio](https://img.shields.io/badge/Portfolio-View-green)](https://sohail3031.github.io/sohail-ahmed-portfolio/)

---

_Built as an enterprise portfolio project demonstrating mid-to-senior SDET skills_
