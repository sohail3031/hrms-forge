# Freamework Architecture

## Document Control

| Field          | Details                |
| -------------- | ---------------------- |
| Document Title | Framework Architecture |
| Project Name   | HRMSForge              |
| Version        | 1.0                    |
| prepared By    | Sohail Ahmed Mohammed  |

---

## 1. Architecture Overview

HRMSForge follows a layered architecture:

```text
┌─────────────────────────────────────────────┐
│ TEST LAYER                                  │
│ tests/ui tests/api tests/integration        │
│ tests/accessibility tests/visual            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│ FIXTURE LAYER                               │
│ Custom fixtures Auth state Test context     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│ PAGE OBJECT LAYER                           │
│ pages/ components/ BasePage                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│ SUPPORT LAYER                               │
│ helpers/ utils/ api/ data/ config/          │
└─────────────────────────────────────────────┘
```

## 2. Key Architecture Decisions

### 2.1 Page Object Model (POM)

Decision: Use POM as primary abstraction pattern

Rationale:

- Separates test logic from page interaction
- Single update point when UI changes
- Tests read like business language
- Industry standard - every SDET must know this

Trade-offs:

PRO: Maintainability, readilibility, resuability

CON: Initial overhead - more fiels upfront

Rule:

If method requires Playwright API directly in a test file, it belongs in a page object instead.

### 2.2 Authentication Strategy

Decision: Playwright storageState via global setup

Rationale:

- Login once per run, not once per test
- 147 tests * 2s login = 5 min saved per run
- Login failures do not cascade to all tests
- Mirrors enterprise framework patters

Alternative rejected:

Login in beforeEach of every test → Slow, fragile, wastes CI time

### 2.3 Locator Strategy

Priority (highest to lowest):

1. data-testid → Most stable
2. ARIA role + name → Accessibility-aligned
3. Accessible label → Stable across design changes
4. Text content → Acceptable but brittle
5. CSS selectors → Last resort

NEVER:

- XPathy by position
- Index-based selectors
- Auto-generated class names

### 2.4 Waiting Strategy

Never: page.waitForTimeout(milliseconds)

Use:

- Auto-waiting → Playwright default behaviour
- Locator waits → except(locator).toBeVisible()
- Network waits → page.waitForResponse()
- State waits → page.waitForLoadState()

### 2.5 Test Isolation

Principle: Every test is completely independent

Implementation:

- Each test creates its own data via faker
- Unique IDs wait timestamps prevent conflicts
- Tests do not share state with other tests
- Cleanup happens in afterEach or teardown

Result:

- True parallel execution across 4 workers
- No synchronization needed between tests

### 2.6 Retry Strategy

Local: retries: 0

- → Failures immediately visible during development
- → Forces fixing root cause not masking with retries

CI: retries: 2

- → Handles container network flakiness
- → Any test passing after retry = flaky candidate

Flaky test SLA:
Detected → Tagged @flaky → Quarantined → Root cause analysis → Fixed within 1 sprint

### 2.7 Parallel Execution

Configuration:

- fullyParallel: true
- workers: 4 (local), 2 (CI)

Requirements for parallel safety:

- Each test creates unique data
- No shared state between tests
- No database dependencies assured
- No hardcoded IDs that conflict

Result:

- 147 tests run in ~ 20 minutes
- Withtout parallel: ~ 60+ minutes

---

## 3. Folder Structuire Rationale

| Folder        | Purpose                | Why Separate                             |
| ------------- | ---------------------- | ---------------------------------------- |
| /tests        | Test specifications    | Keeps tests separate from framework code |
| /pages        | Page Objects           | Single update point per page             |
| /compunds     | Resuable UI components | DRY - used across multiple pages         |
| /fixtures     | Playwright fixtures    | Clean dependency injection               |
| /api          | API clients            | Abstraction over HTTP calls              |
| /helpers      | Business helpers       | Test-level shortcuts                     |
| /utils        | Low-level utilities    | Resuable technical functions             |
| /config       | Configuration          | Single source of truth                   |
| /data         | Test data              | Separate from test logic                 |
| /global-setup | Pre-suite setup        | Runs once, not per test                  |

---

## 4. CI/CD Architecture

```
Every Push
└── Smoke Tests (Chromium, < 3 min)

Every PR to main
├── PR Quality Check (lint + types, < 2 min)
└── Regression Suite (Chromium, < 20 min)
└── Both must pass before merge

Nightly 2 AM EST
├── Chromium Full Suite
├── Firefox Smoke Suite
├── WebKit Smoke Suite
└── Accessibility Tests (axe-core)
└── Results → Allure → GitHub Pages
```

## 5. Technology Dicisions

### Why Playwright over Selenium

| Factor             | Playwright       | Selenium              |
| ------------------ | ---------------- | --------------------- |
| Auto-waiting       | Built-in         | Manual explicit waits |
| API testing        | Built-in         | Separate tool needed  |
| Multi-browser      | Single framework | Multiple drivers      |
| Trace viewer       | Built-in         | Not available         |
| Speed              | Faster           | Slower                |
| Active development | Microsoft backed | Community             |

### Why Typescript over JavaScript

- Type safety catches errors at compile time
- IntelliSense/autocomplete speed development
- Self-documenting - types communicate intent
- Industry standard for enterprise Playwright projects

### Why k6 over JMeter

- k6: JavaScript scripting, CI/CD native, developer-friendly
- JMeter: GUI-based, XML config, enterprise legacy

k6 wins for:

- Version control friendly (JS scripts)
- CI/CD integration (exit code on threshold vreach)
- Modern JavScript developer experience
- Growing enterprise adoption (Netflix, Microsoft)

### Why Allure over HTML report only

Allure provides:

- History trending across runs
- Automatic failure categorization
- Step-level detail with screenshots
- Stakeholder-friendly dashboard
- GitHub Pages publishing

Playwright HTML report:

- Great for local debugging
- No history tracking
- Not stakeholder-friendly

---

_Document Version 1.0 - HTMSForge Project_

_Prepared by: Sohail Ahmed Mohammed - QA Automation Engineer_
