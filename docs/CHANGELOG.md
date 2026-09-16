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

## [0.2.0-documentation] - Sprint 0 Phase 2

### Added

- /docs folder with complete project documentation
- Business Requirements Document (RRD.md)
- Software Requirements Specification (SRS.md)
- Test Strategy document (TEST_STRATEGY.md)
- Framework Architecture document (ARCHITECTURE.md)
- Bug Reports document (BUG_REPORTS.md) - 25 bugs
- Master Test Cases Excel (TEST_CASES.xlsx) - 150+ scenarios
- Changelog (CHANGELOG.md)
- Sprint 0 review notes
- Sprint 1 planning notes
- CONTRIBUTING.md in project root
- Permanent login page smoke test (CI health)
- Permanent accessibility placeholder test (CI health)

### Changed

- README.md updated with complete setup guide
- nightly.yml fixed - accessibility job pinned to chromium
- package.json scripts updated for consistency
- .gitignore updated for Excel temp files

---

## [0.3.0-auth] — Sprint 1 Week 1

### Added

**Framework Foundation (Steps 26-31)**

- utils/logger.ts — Winston structured logging
  (console + file transport, log.step/action/assert)
- pages/base/BasePage.ts — abstract base for all POMs
  (24 methods covering nav, wait, interact, toast, dialog)
- components/NavigationMenu.ts — OrangeHRM side nav
- components/Toast.ts — toast notification handler
- components/Modal.ts — confirmation modal handler
- global-setup/globalSetup.ts — real multi-role auth
  (Admin + ESS + Supervisor via API then browser)
- global-teardown/globalTeardown.ts — test data cleanup
- utils/authHelper.ts — shared getAdminToken()
- helpers/testDataFactory.ts — faker-based data
  (employee, credentials, leave, personal, contact, emergency)
- api/clients/BaseApiClient.ts — HTTP abstraction
- api/clients/AuthApiClient.ts — auth API client
- api/schemas/auth.schema.json

**Auth Page Objects (Step 32)**

- pages/auth/LoginPage.ts — 15 methods, 9 locators
- pages/dashboard/DashboardPage.ts — minimal version

**Auth Tests (Steps 33-38)**

- tests/ui/auth/login.spec.ts — TC-AUTH-001 to 012
- tests/ui/auth/logout.spec.ts — TC-AUTH-009,010,015
- tests/ui/auth/session.spec.ts — TC-AUTH-018,019,020
- tests/ui/auth/rbac.spec.ts — TC-AUTH-016,017

### Fixed

- Removed afterEach logout causing test flakiness
- Fixed accessibility test redirect (storageState clear)
- Fixed nightly workflow (accessibility pinned to chromium)
- Husky v10 deprecated shell lines removed

### Patterns Established

- test.use() storageState clear for unauthenticated tests
- Negative tests use login() not loginAndWaitForDashboard()
- No afterEach logout — Playwright context isolation
- test.fixme() for known OrangeHRM demo limitations
- test.skip() for missing prerequisite files
- ESS storageState via test.use() override per file

---

_HRMSForge — Enterprise QA Automation Framework_
