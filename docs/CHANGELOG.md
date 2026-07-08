# Changelog

All notable changes to HRMSForge are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com).

---

## [Unreleased]

### Planned

- Authentication test suite (Sprint 1)
- Employee management tests (Sprint 1)
- API test layer (Sprint 2)
- Leave management tests (Sprint 2)

---

## [0.1.0-infrastructure] — Sprint 0

### Added

- GitHub repository with branch protection rules
- Node.js 20 LTS + TypeScript 5.x project setup
- Playwright 1.40+ with 9 browser projects configured
- ESLint 8.x with Playwright-specific rules
- Prettier for consistent code formatting
- Husky pre-commit hooks with commitlint
- Complete enterprise folder structure (17 phases)
- Typed environment configuration with validation
- URL builder utility
- Docker configuration with multi-service compose
- 4 GitHub Actions workflows:
  - Smoke tests (every push)
  - PR quality check (every PR)
  - Regression suite (PR to main)
  - Nightly cross-browser matrix (2 AM EST)
- Allure reporter with categories and environment info
- GitHub Pages for Allure report publishing
- Jira project with 7 epics and Sprint 0/1 setup
- Login page smoke test (CI health check)
- Accessibility placeholder test (CI health check)

### Technical Decisions

- TypeScript strict mode enabled
- Playwright storageState for multi-role authentication
- faker-js for dynamic test data generation
- Conventional Commits enforced via commitlint
- Branch protection requiring CI status checks

---

_HRMSForge — Enterprise QA Automation Framework_
