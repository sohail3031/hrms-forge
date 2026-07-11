# Test Strategy

## Document Control

| Field          | Details                                        |
| -------------- | ---------------------------------------------- |
| Document Title | Test Strategy                                  |
| Project Name   | HRMSF-rge - OrangeHRM QA Automation Framework  |
| Version        | 1.0                                            |
| Status         | Approved                                       |
| Prepared By    | Sohail Ahmed Mohammed - QA Automation Engineer |

---

## 1. Test Scope

### 1.1 In Scope

| Module                                   | Coverage            |
| ---------------------------------------- | ------------------- |
| Authentication                           | UI + API + Security |
| PIM - Employee Management                | UI + API            |
| Leave Management                         | UI + API            |
| Admin - User Mangement                   | UI                  |
| Directory                                | UI                  |
| My Info - Personal Details               | UI                  |
| Reports - Export                         | UI                  |
| API - All documented exdpoints           | API                 |
| Corss-browser (Chomium, Firefox, Webkit) | UI                  |
| Accessibility - WCAG 2.1 AA              | Accessibility       |
| Visual Regression                        | Visual              |
| Performance baselines                    | Performance         |

### 1.2 Out of Scope

| Item                          | Reason                         |
| ----------------------------- | ------------------------------ |
| Backend database verification | No DB access in demo           |
| Email/SMTP workflow           | No email server configuration  |
| Payroll module                | Insufficient test data in demo |
| Mobile native app             | No native app available        |
| Full penetration testing      | Outside automation scope       |
| Load testing beyond baselines | Shared demo server             |

---

## 2. Testing Types

### 2.1 Smoke Testing

```
Purpose  : Verify the application is up and critical path works after every deployment or build
Scope    : 5-10 critical tests maximum
Tags     : @smoke
Trigger  : Every CI push, every development
Duration : < 3 minutes
Tool     : Playwright
Tests    :
    Login with valid admin credentials
    Dashboard renders correctly
    PIM module loads
    Logout works
    API health check
```

### 2.2 Regression Testing

```
Purpose  : Ensure existing functionality has not been broken by new changes
Scope    : Full test suite
Tags     : @regression
Trigger  : Nightly + PR to main
Duration : < 20 minutes with parallel execution
Tool     : Playwright
Strategy :
    All tests tagged @regression run automatically
    Parallel execution acrtoss 4 workers
    Results published to Allure dashboard
```

### 2.3 API Testing

```
Purpose  : Validate REST API contracts, response schemas, status codes, error handling, and business logic
Tool     : Playwright APIRequestCintext
Tags     : @api
Coverage : All documented OrangeHRM API v2 endpoints
Approach :
    Status code validation
    Response schema validation (Ajv)
    Business rule validation
    Authentication and authorization tests
    Error response validation
```

### 2.4 Integration Testing

```
Purposr  : Test integrations between UI and API layers
Tool     : Playwright (hybrid API + UI)
Tags     : @integration
Patterns :
    Create via API → verify in UI
    Create via UI → verify via API
    Approve via API → verify status in UI
```

### 2.5 Accessibility Testing

```
Purpose          : Verify WCAG 2.1 AA compilance on key pages
Tool             : @axe-core/playwright
Tags             : @accessibility @a11y
Standard         : WCAG 2.1 Level AA AODA (Accessibility for Ontarios with Disabilities Act)
Pages            :
    Login page
    Dashboard
    Employee List
    Employee Profile
    Leave Apply form
CI Policy        :
    Fail CI : Critical + Senarios voilations
    Warn    : Moderate violations
    Track   : Minor violations in backlog
Known Limitation :
    axe-core catches ~30-40% of accessibility issues.
    Manual screen render testing is required for full coverage.

```

### 2.6 Visual Regression Testing

```
Purpose   : Detect unintended UI changes
Tool      : Playwright built-in screenshot comparision
Tags      : @visual
Baseline  : Stored in /tests/visual/baselines/
Pages     :
    Login page
    Dashboard
    PIM EMployee List
    Add Employee form
Approach  :
    Capture baseline on first run
    Compare on subsequent runs
Threshold : 0.1% pixel difference
```

### 2.7 Performance Testing

```
Purpose    : Establish and monitor key performance metrics
Tool       : k6 (Grafana)
Tags       : @performance
Target     : OrangeHRM REST API endpoints
Test Types :
    Smoke      : 1 VU, 1 min - baseline validation
    Load       : 10 VUs, 9 min - normal traffic SLA
    stress     : 0-50 VUs, 13 min - find breaking point
    Spike      : 2-50 VUs sudden, 5 min - surge simulation
    Soak       : 10 VUs, 30 min - endurance/memory leaks
    Breakpoint : Incremental - capacity planning
SLAs       :
    Login         : p95 < 1000ms
    Employee list : p95 < 2000ms
    Leave apply   : p95 < 2000 ms
    Error rate    : < 1% under normal load
CI Policy  :
    Performance tests run NIGHTLY only.
    Never on every push (shared demo server).
```

### 2.8 Security Testing (Basic)

```
Purpose  : Basic security validation within automation scope
Tool     : Playwright negative tests
Tags     : @security
Coverage :
    Unauthenticated access to protected routes
    Session token handling
    XSS attempt in input fields
    SQL injection in search fields
    HTTPS enforcement
    Sensitive data in URL parameters
    Role-based access control enforcement
```

### 2.9 Cross-Browser Testing

```
Browsers             : Chromium, Firefox, Webkit (Safari engine)
Strategy             :
    Smoke + critical path : all 3 browsers
    Full regression       : Chromium only
Why Chromium primary :
    Most enterprise users are on chrome-based browsers.
    Full cross-browser regression would triple execution time with minimal additional defect detection value.
    Firefox and Webkit run nightly for moke coverage.
```

## 3. Test Environment

| Environment     | URL                               | Purpose     | Reset     |
| --------------- | --------------------------------- | ----------- | --------- |
| Demo (External) | opensource-demo.orangehtmlive.com | Dev + CI    | ~Hourly   |
| Local Docker    | localhost                         | Offlien dev | On demand |
| CI Runner       | GitHub Actions Ubuntu             | Pipeline    | Per run   |

## 4. Test Data Strategy

### 4.1 Dynamic Data Generation

```
Tool     : @faker-js/faker
Pattern  : Generate unique data per test using timestamps
Examples :
    Employee : {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        employeeId: EMP-${Date.now()}
    }
    Why      :
        Prevents copnflicts when tests run in parallel
        Prevents failures when demo environment resets
        Makes tests truly independent
```

### 4.2 Static Refernce Data

```
Location : /data/.json
Contents :
    testData.json      Application URLs and timeouts
    employees/.json    Employee data templates
    leave/*.json       Leave type reference data
Rule     :
    Never hardcode names like "JOhn Smith" in tests
    Always generate unique data per test run
```

### 4.3 Test Data Cleanup

```
Strategy:
    Create data in beforeEach or test setup
    Clean up in afterEach or global teardown
    Use API for setup/teardown (faster than UI)
    Tag data with timestamps for identification
```

---

## 5. Authentication Strategy

```
Pattern                                   : Playwright storageState
Global Setup (runs ONCE before all tests) :
    Login as Admin via API → save admin.json
    Login as ESS user via API → save ess-user.json
    Login as Supervisor via API → save supervisor.json

Each project pre-loads the correct auth state.
Tests start already authenticated.

Benifits                                  :
    Login once per run, not once per test
    147 tests × ~2s login = ~5 min saved per run
    Login failures do not cascade to every test
    Mirrors enterprise framework authentication patterns
```

## 6. Defgect Management

### 6.1 Severity Clasification

| Severity | Definition                                  | Example                     |
| -------- | ------------------------------------------- | --------------------------- |
| Critical | System unstable, data loss, security breach | Login broken, SQL injection |
| High     | Major feature broken, no workaround         | Cannot add employee         |
| Medium   | Feature partially broken, workaround exists | Sort not working            |
| Low      | Minor issue, cosmetic                       | Tooltip text wrong          |

### 6.2 Bug Lifecycle

```
Open → In Progress → Fixed → Ready for Retest → Closed
  ↓
Rejected (not a bug / by design)
  ↓
Deferred (known, fix later)
```

### 6.3 Bug Report Template

Each bug report must include:

- Bug ID
- Title (clear, specific)
- Sevirity + Priority
- Module + Environment
- Steps to reproduce (numbered)
- Expected result
- Actual result
- Root cause hypothesis
- Attachments (screenshot, video, logs)
- Test case reference (TC-ID)

## 7. CI/CD Strategy

### 7.1 Pipeline Overview

| Workflow           | Trigger          | Scope                | Duration |
| ------------------ | ---------------- | -------------------- | -------- |
| Smoke Tests        | Every push       | @smoke chromium      | < 3 min  |
| PR Quality Check   | Every PR to main | Lint + TypeScript    | 2 < min  |
| Regression Suite   | PR to main       | Chromium full suite  | < 20 min |
| Nightly Full Suite | 2 AM EST         | Corss-browser + A11y | < 45 min |
| Allure Report      | After nightly    | Publish to Pages     | < 5min   |

### 7.2 Quality Gates

PR cannot merge to main unless:

- ✅ ESLint passes (0 errors)
- ✅ TypeScript compiles (0 errors)
- ✅ Prettier formatting passes
- ✅ Smoke tests pass on Chromium
- ✅ Regression suite passes on Chromium

### 7.3 Flaky Test Policy

```
Detection :
    Any test that passes after retry = flaky candidate
    Allure history shows retry patterns
Response  :
    Tag test @flaky immediately
    Root cause analysis using Playwright trace viewer
    Fix within 1 sprint - SLA for flaky test resolution
    Remove @flaky tag after 20+ stable runs
Never     :
    Leave flaky tests in main suite permanently
    Add waitForTimeout() as "fix"
    Increase retry count as a permanent solution
```

---

## 8. Reporting Strategy

### 8.1 Allure Report

```
Published: GitHub Pages after every nightly run
URL: https:// sohail3031.github.io/hrms/forge/
Contents:
    Test summary (pass/fail/skip counts)
    Failure trend over time
    Category breakdown (bugs vs infrastructure vs flaky)
    Step-level test details
    Screenshots on failure
    Video on failure
    Playwright trace links
    Environment information
```

### 8.2 PR Comments

```
After every PR regression run     :
    Automated comment posted with :
        Pass/fail status
        Browser tested
        Link to GitHub Actions run
        Link to report artifact
```

### 8.3 Failure Evidence

```
On every test failure CI captures :
    Screenshot at point of failure
    Video of full test execution
    Playwright trace (full network + DOM snapshot)

All uploaded as GitHUb Actions artifacts.
Retained for 14 days on PR runs, 30 days on nightly.
```

---

## 9. Risk Mitigation

| Risk                     | Mitigation Strategy                               |
| ------------------------ | ------------------------------------------------- |
| Demo environement reset  | Global setup recreates data before each run       |
| Shared environemnt state | unique timestamps in all test data                |
| Brittle locators         | data-testid > ARIA > label > text > CSS hierarchy |
| Flaky tests              | Retry on CI, quarantine tag, 1-sprint fix SLA     |
| Browser incompatibility  | Nightly cross-browser matrix                      |
| CI resource limits       | Parallel workers limited to 2 in CI               |
| API rate limiting        | Sequential execution for auth flood tests         |

---

## 10. Tools and Technologies

| Tool                 | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| Playwright           | 1.40+   | UI + API automation     |
| TypeScript           | 5.x     | Type-safe scripting     |
| @axe-core/playwright | Latest  | Accessibility testing   |
| k6                   | Latest  | Performance testing     |
| @faker-js/faker      | Latest  | Test data generation    |
| Allure Report        | 2.x     | Test reporting          |
| GitHub Actions       | -       | CI/CD pipeline          |
| Docker               | -       | Containerized execution |
| ESLint               | 8.x     | Code quality            |
| Husky                | Latest  | Pre-commit hooks        |

---

_Document Version 1.0 - HRMSForge Project_
_Prepared by: Sohail Ahmed Mohammed - QA Automation Engineer_
