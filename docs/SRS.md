# Software Requirements Specification (SRS)

## Document Control

| Field          | Details                                        |
| -------------- | ---------------------------------------------- |
| Document Title | Software Requirements Specification            |
| Project Name   | HRMSForge — OrangeHRM QA Automation Framework  |
| Version        | 1.0                                            |
| Status         | Approved                                       |
| Prepared By    | Sohail Ahmed Mohammed — QA Automation Engineer |
| Based On       | BRD v1.0                                       |

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional
requirements for the HRMSForge QA automation framework.
It defines what must be tested, how it must be tested,
and the quality standards that must be met.

### 1.2 Scope

The framework covers automated testing of the OrangeHRM
Human Resource Management System across the following
testing dimensions:

- UI automation (Playwright + TypeScript)
- API testing (Playwright APIRequestContext)
- Accessibility testing (@axe-core/playwright)
- Visual regression (Playwright screenshots)
- Performance testing (k6)

### 1.3 Definitions

| Term         | Definition                                             |
| ------------ | ------------------------------------------------------ |
| AUT          | Application Under Test — OrangeHRM HRMS                |
| POM          | Page Object Model — design pattern for UI automation   |
| storageState | Playwright mechanism for saving browser auth state     |
| ESS          | Employee Self-Service — limited user role in OrangeHRM |
| WCAG         | Web Content Accessibility Guidelines                   |
| VU           | Virtual User — simulated user in k6 performance tests  |
| Threshold    | SLA definition in k6 — breach causes test failure      |
| Fixture      | Playwright mechanism for reusable test setup           |

---

## 2. Functional Requirements

### 2.1 Authentication Module

| ID          | Requirement                                     | Priority | Acceptance Criteria                            |
| ----------- | ----------------------------------------------- | -------- | ---------------------------------------------- |
| FR-AUTH-001 | System shall authenticate valid admin user      | Critical | Admin logs in and accesses dashboard           |
| FR-AUTH-002 | System shall reject invalid credentials         | Critical | Error shown, no session created                |
| FR-AUTH-003 | System shall reject empty credentials           | High     | Validation error without API call              |
| FR-AUTH-004 | System shall maintain session across navigation | Critical | User stays logged in between pages             |
| FR-AUTH-005 | System shall destroy session on logout          | Critical | After logout, protected URLs redirect to login |
| FR-AUTH-006 | System shall enforce role-based navigation      | Critical | ESS user cannot see admin navigation           |
| FR-AUTH-007 | System shall reject disabled user accounts      | High     | Disabled user cannot log in                    |

### 2.2 PIM Module — Employee Management

| ID         | Requirement                               | Priority | Acceptance Criteria              |
| ---------- | ----------------------------------------- | -------- | -------------------------------- |
| FR-PIM-001 | Admin shall add a new employee            | Critical | Employee appears in directory    |
| FR-PIM-002 | Admin shall edit existing employee        | Critical | Changes persisted after save     |
| FR-PIM-003 | Admin shall delete an employee            | High     | Employee removed from directory  |
| FR-PIM-004 | Admin shall search employees by name      | High     | Matching results returned        |
| FR-PIM-005 | Admin shall filter by employment status   | High     | Filter applied correctly         |
| FR-PIM-006 | System shall validate mandatory fields    | Critical | Error shown for missing fields   |
| FR-PIM-007 | Admin shall upload employee profile photo | Medium   | Photo displayed on profile       |
| FR-PIM-008 | Employee ID shall be unique               | Critical | Duplicate ID rejected            |
| FR-PIM-009 | Admin shall export employee list          | Medium   | CSV downloaded with correct data |

### 2.3 Leave Module

| ID         | Requirement                          | Priority | Acceptance Criteria                 |
| ---------- | ------------------------------------ | -------- | ----------------------------------- |
| FR-LVE-001 | ESS user shall apply for leave       | Critical | Request created with Pending status |
| FR-LVE-002 | Manager shall approve leave request  | Critical | Status changes to Approved          |
| FR-LVE-003 | Manager shall reject leave request   | High     | Status changes to Rejected          |
| FR-LVE-004 | System shall prevent leave overlap   | High     | Error shown for overlapping dates   |
| FR-LVE-005 | ESS user shall cancel pending leave  | Medium   | Status changes to Cancelled         |
| FR-LVE-006 | System shall calculate leave balance | Critical | Balance decreases after approval    |

### 2.4 Admin Module

| ID         | Requirement                      | Priority | Acceptance Criteria               |
| ---------- | -------------------------------- | -------- | --------------------------------- |
| FR-ADM-001 | Admin shall create system user   | Critical | User can log in with credentials  |
| FR-ADM-002 | Admin shall disable user account | High     | Disabled user cannot log in       |
| FR-ADM-003 | Admin shall create job title     | Medium   | Job title available in PIM        |
| FR-ADM-004 | Admin shall manage pay grades    | Medium   | Pay grade assignable to employees |

### 2.5 API Requirements

| ID         | Requirement                                    | Priority | Acceptance Criteria          |
| ---------- | ---------------------------------------------- | -------- | ---------------------------- |
| FR-API-001 | POST /auth/login shall return JWT token        | Critical | 200 response with token      |
| FR-API-002 | Unauthenticated requests shall be rejected     | Critical | 401 response                 |
| FR-API-003 | ESS user shall not access admin endpoints      | Critical | 403 response                 |
| FR-API-004 | POST /pim/employees shall create employee      | Critical | 200 with employee object     |
| FR-API-005 | GET /pim/employees shall return paginated list | High     | 200 with data array and meta |
| FR-API-006 | Invalid request body shall return 400          | High     | 400 with validation errors   |
| FR-API-007 | Non-existent resource shall return 404         | High     | 404 response                 |
| FR-API-008 | Response schema shall match contract           | High     | All required fields present  |

---

## 3. Non-Functional Requirements

### 3.1 Performance Requirements

| ID           | Requirement                      | Metric       | Tool           |
| ------------ | -------------------------------- | ------------ | -------------- |
| NFR-PERF-001 | Login page load time             | < 3 seconds  | Playwright CDP |
| NFR-PERF-002 | Employee search response         | < 2 seconds  | k6             |
| NFR-PERF-003 | API response time (p95)          | < 2000ms     | k6             |
| NFR-PERF-004 | API response time (p99)          | < 4000ms     | k6             |
| NFR-PERF-005 | System under 10 concurrent users | All SLAs met | k6 load test   |
| NFR-PERF-006 | Error rate under normal load     | < 1%         | k6             |

### 3.2 Reliability Requirements

| ID          | Requirement              | Metric                                         |
| ----------- | ------------------------ | ---------------------------------------------- |
| NFR-REL-001 | Test suite stability     | < 2% flakiness rate in CI                      |
| NFR-REL-002 | CI pipeline availability | Runs on every push without manual intervention |
| NFR-REL-003 | Retry strategy           | Max 2 retries on CI for transient failures     |

### 3.3 Maintainability Requirements

| ID          | Requirement           | Standard                                         |
| ----------- | --------------------- | ------------------------------------------------ |
| NFR-MNT-001 | Page Object coupling  | Zero test files importing from another test file |
| NFR-MNT-002 | Locator strategy      | data-testid > ARIA role > label > text > CSS     |
| NFR-MNT-003 | Hard waits            | Zero waitForTimeout() calls in codebase          |
| NFR-MNT-004 | Code quality          | Zero ESLint errors on every commit               |
| NFR-MNT-005 | TypeScript compliance | Zero type errors — strict mode enabled           |

### 3.4 Scalability Requirements

| ID          | Requirement        | Standard                                        |
| ----------- | ------------------ | ----------------------------------------------- |
| NFR-SCL-001 | Parallel execution | Suite runs across 4 workers locally             |
| NFR-SCL-002 | CI execution time  | Full regression under 20 minutes                |
| NFR-SCL-003 | Cross-browser      | Smoke suite passes on Chromium, Firefox, WebKit |

### 3.5 Security Requirements

| ID          | Requirement            | Standard                                       |
| ----------- | ---------------------- | ---------------------------------------------- |
| NFR-SEC-001 | Credential handling    | No credentials in source code or logs          |
| NFR-SEC-002 | Auth state files       | Never committed to version control             |
| NFR-SEC-003 | Environment variables  | Loaded from .env locally, GitHub Secrets in CI |
| NFR-SEC-004 | Sensitive data in URLs | No passwords or tokens in URL parameters       |

### 3.6 Accessibility Requirements

| ID           | Requirement            | Standard                           |
| ------------ | ---------------------- | ---------------------------------- |
| NFR-A11Y-001 | WCAG compliance target | WCAG 2.1 Level AA                  |
| NFR-A11Y-002 | axe violation policy   | Zero Critical/Serious violations   |
| NFR-A11Y-003 | Keyboard navigation    | Login completable by keyboard only |
| NFR-A11Y-004 | Color contrast         | Minimum 4.5:1 for normal text      |
| NFR-A11Y-005 | Regulatory compliance  | AODA (Ontario) requirements met    |

### 3.7 Reporting Requirements

| ID          | Requirement            | Standard                                     |
| ----------- | ---------------------- | -------------------------------------------- |
| NFR-RPT-001 | Test result visibility | Allure report generated on every CI run      |
| NFR-RPT-002 | Failure evidence       | Screenshots + video + trace on every failure |
| NFR-RPT-003 | Trend reporting        | Allure history tracking across runs          |
| NFR-RPT-004 | Stakeholder access     | Report published to GitHub Pages             |
| NFR-RPT-005 | Failure classification | Automatic via Allure categories              |

---

## 4. User Stories

### Epic 1 — Authentication & Security

```
US-001: Valid Login
As an Admin user,
I want to log in with valid credentials,
So that I can access the HR management system.

Acceptance Criteria:
  Given I am on the login page
  When I enter valid admin credentials
  Then I am redirected to the dashboard
  And the admin navigation is visible
  And my username is displayed in the header

Story Points: 3 | Priority: Critical | Sprint: 1
```

```
US-002: Invalid Login
As the system,
I want to reject invalid login attempts,
So that unauthorized access is prevented.

Acceptance Criteria:
  Given I am on the login page
  When I enter invalid credentials
  Then I see "Invalid credentials" error
  And I remain on the login page
  And no session cookie is created

Story Points: 2 | Priority: Critical | Sprint: 1
```

```
US-003: Secure Logout
As a logged-in user,
I want to securely log out,
So that my session is terminated.

Acceptance Criteria:
  Given I am logged in
  When I click logout
  Then my session is destroyed
  And I am redirected to the login page
  And accessing /dashboard redirects back to login

Story Points: 2 | Priority: Critical | Sprint: 1
```

```
US-004: Role-based Access Control
As the system,
I want to enforce role-based navigation,
So that ESS users cannot access admin functionality.

Acceptance Criteria:
  Given I am logged in as ESS user
  When I navigate to admin URL directly
  Then I am denied access
  And I see an appropriate error or redirect

Story Points: 3 | Priority: Critical | Sprint: 1
```

### Epic 2 — Employee Management (PIM)

```
US-005: Add New Employee
As an Admin,
I want to add a new employee to the system,
So that their profile is available for HR operations.

Acceptance Criteria:
  Given I am on the Add Employee page
  When I fill in all required fields and submit
  Then the employee is created with unique Employee ID
  And I am redirected to the employee profile
  And the employee appears in PIM directory

Story Points: 5 | Priority: Critical | Sprint: 1
```

```
US-006: Search Employee
As an Admin,
I want to search for employees by name,
So that I can quickly locate a specific record.

Acceptance Criteria:
  Given the employee directory is loaded
  When I enter a name in the search field
  Then matching employees are displayed
  And non-matching employees are hidden

Story Points: 3 | Priority: High | Sprint: 1
```

```
US-007: Edit Employee
As an Admin,
I want to edit an existing employee's details,
So that their record stays accurate.

Acceptance Criteria:
  Given an employee exists in the system
  When I modify a field and save
  Then the change is persisted
  And the updated value is visible on the profile

Story Points: 3 | Priority: Critical | Sprint: 1
```

```
US-008: Delete Employee
As an Admin,
I want to delete an employee record,
So that terminated employees are removed.

Acceptance Criteria:
  Given an employee exists
  When I confirm deletion
  Then the employee is removed from the directory
  And a success confirmation is displayed

Story Points: 3 | Priority: High | Sprint: 1
```

### Epic 3 — Leave Management

```
US-009: Apply for Leave
As an ESS Employee,
I want to submit a leave request,
So that my time-off is tracked and approved.

Acceptance Criteria:
  Given I am logged in as ESS employee
  When I complete the leave apply form
  Then a request is created with Pending Approval status
  And the request appears in my Leave List

Story Points: 5 | Priority: Critical | Sprint: 2
```

```
US-010: Approve Leave
As a Supervisor,
I want to approve a pending leave request,
So that the employee's leave is officially granted.

Acceptance Criteria:
  Given a leave request is Pending Approval
  When the supervisor approves it
  Then the status changes to Approved
  And the employee's leave balance is updated

Story Points: 5 | Priority: Critical | Sprint: 2
```

---

## 5. Definition of Ready (DoR)

A user story is ready for a sprint when ALL of the following are true:

- [ ] Written in standard format (As a / I want / So that)
- [ ] Acceptance criteria defined and agreed
- [ ] Story estimated in story points
- [ ] Dependencies identified and resolved
- [ ] Test data requirements documented
- [ ] API endpoints relevant to story are documented
- [ ] UI screens are accessible
- [ ] Story fits within a single sprint (< 8 points)
- [ ] Product Owner has approved the story

---

## 6. Definition of Done (DoD)

A user story is DONE when ALL of the following are true:

- [ ] Automated test(s) written and passing locally
- [ ] Automated test(s) passing in CI pipeline
- [ ] API test(s) written for relevant endpoints
- [ ] Page Objects created/updated for new UI elements
- [ ] Code reviewed and approved
- [ ] Tests tagged appropriately
- [ ] Allure report reflects test results
- [ ] No new flaky tests introduced
- [ ] PR merged to develop branch
- [ ] Bug reports filed for any defects found
- [ ] Jira ticket moved to Done

---

## 7. Test Environment

| Environment     | URL                               | Purpose             |
| --------------- | --------------------------------- | ------------------- |
| Demo (External) | opensource-demo.orangehrmlive.com | Development + CI    |
| Local Docker    | localhost (optional)              | Offline development |
| CI Runner       | GitHub Actions Ubuntu             | Pipeline execution  |

### Known Limitations

- Demo resets periodically (~hourly)
- Shared environment — other users may affect state
- No email server — password reset untestable end to end
- File uploads limited to supported formats
- Rate limiting possible on shared server

---

## 8. Framework Requirements

### 8.1 Page Object Model

- One class per page
- Locators defined as readonly properties
- Action methods only — no assertions in POM
- Extend BasePage for common functionality
- Reusable components extracted to /components

### 8.2 Authentication Strategy

- Global setup authenticates all roles once per run
- storageState saved per role to fixtures/auth/
- Tests pre-load correct auth state via project config
- No login logic inside individual test files

### 8.3 Test Data Strategy

- Dynamic data generated via @faker-js/faker
- Unique IDs use timestamps to prevent conflicts
- Static reference data stored in /data/*.json
- No hardcoded test data in test files
- Test data cleaned up in afterEach/global teardown

### 8.4 Locator Strategy (Priority Order)

- data-testid attributes
- ARIA roles (getByRole)
- Accessible labels (getByLabel)
- Text content (getByText)
- CSS selectors (last resort)

NEVER: XPath by position, index-based, auto-generated classes

### 8.5 Waiting Strategy

NEVER use: page.waitForTimeout()
USE instead:

- Auto-waiting (Playwright default)
- expect(locator).toBeVisible()
- page.waitForResponse()
- page.waitForLoadState()

---

_Document Version 1.0 — HRMSForge Project_

_Prepared by: Sohail Ahmed Mohammed — QA Automation Engineer_
