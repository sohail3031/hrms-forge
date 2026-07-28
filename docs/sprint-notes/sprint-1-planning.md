# Sprint 1 Planning

## Sprint Details

| Field    | Details                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Sprint   | Sprint 1 - Authentication & Employee Management                                                                            |
| Duration | 2 weeks                                                                                                                    |
| Goal     | Deliver complete automated coverage of authentication flows and core employee management with passing CI and Allure report |
| Status   | 🔄 Starting                                                                                                                |

---

## Sprint Goal

Deliver complete automated coverage of authentication flows and code employee management (add, search, edit, delete) with passing CI pipeline and Allure report.

---

## Definition of Ready Checklist

Before each story enters Sprint 1:

- [x] US-001 Valid login → Ready
- [x] US-002 Invalid login → Ready
- [x] US-003 Session persistence → Ready
- [x] US-004 Secure logout → Ready
- [x] US-005 Role-based access → Ready
- [x] US-006 Add employee → Ready
- [x] US-007 Search employee → Ready
- [x] US-008 Edit employee → Ready
- [x] US-009 Delete employee → Ready

---

## Sprint Backlog

### Framework Foundation (prerequisite for tests)

| Ticket | Title                             | Points | Phase Step |
| ------ | --------------------------------- | ------ | ---------- |
| HF-23  | Build BasePage.ts                 | 2      | Step 26    |
| HF-24  | Build global-setup.ts (real auth) | 3      | Step 27    |
| HF-25  | Build global-teardown.ts          | 1      | Step 28    |
| HF-26  | Build testDataFactory.ts          | 2      | Step 29    |
| HF-27  | Build BaseApiClient.ts            | 2      | Step 30    |
| HF-28  | Build AuthApiClient.ts            | 1      | Step 31    |

### Authentication Tests

| Ticket | Title                                  | Points | Test Cases              |
| ------ | -------------------------------------- | ------ | ----------------------- |
| HF-29  | Build LoginPage.ts (POM)               | 2      | -                       |
| HF-30  | TC-AUTH-001 Valid admin login          | 3      | TC-AUTH-001             |
| HF-31  | TC-AUTH-002/003 Invalid credentials    | 2      | TC-AUTH-002,003         |
| HF-32  | TC-AUTH-004/005/006 Empty fields       | 2      | TC-AUTH-004,005,006     |
| HF-33  | TC-AUTH-009 Logout                     | 2      | TC-AUTH-009             |
| HF-34  | TC-AUTH-010 Protected URL after logout | 2      | TC-AUTH-010             |
| HF-35  | TC-AUTH-016/017 RBAC ESS vs Admin      | 3      | TC-AUTH-016,017         |
| HF-36  | Remaining auth tests                   | 3      | TC-AUTH-007,008,011-015 |

### PIM Tests

| Ticket | Title                           | Points | Test Cases         |
| ------ | ------------------------------- | ------ | ------------------ |
| HF-37  | Build Employee Page Objects     | 3      | -                  |
| HF-38  | TC-PIM-001/002/003 Add employee | 5      | TC-PIM-001,002,003 |
| HF-39  | TC-PIM-004/005 Validation       | 2      | TC-PIM-004,005     |
| HF-40  | TC-PIM-007/008/009/010 Search   | 3      | TC-PIM-007-010     |

---

## Capacity

| Resource      | Availability Days | Story Points |
| ------------- | ----------------- | ------------ |
| Sohail (SDET) | 10 days           | 30 points    |

## Committed Points

- Framework Foundation: 11 points
- Authentication Tests: 19 points
- PIM Tests (partial): 13 points
- Total Committed: 30 points (adjusted to capacity)

---

## Technical Prerequisites

Before first test can be written:

- Step 26: BasePage.ts ← All pages inherit from this
- Step 27: global-setup.ts ← Real auth state generation
- Step 28: global-teardown.ts ← Test data cleanup
- Step 29: testDataFactory.ts ← Dynamic data generation
- Step 30: BaseApiClient.ts ← HTTP client abstraction
- Step 31: AuthApiCLient.ts ← Login/token management

---

## Sprint 1 Week Plan

### Week 1 - Foundation

- Day 1-2: Step 26 - BasePage.ts, Step 27 - global-setup.ts (real auth)
- Day 3: Step 28 - global-teardown.ts, Step 29 - testDataFactory.ts
- Day 4-5: Step 30-31 - BaseApiClient + AuthApiClient Validate auth state files generate correctly

### Week 2 - Tests

- Day 6-7: Step 32-34 - LoginPage.ts + auth tests (TC-AUTH-001 to 006)
- Day 8: Step 35-36 - Logout + session tests
- Day 9: Step 37-38 - Role-based access + remaining auth
- Day 10: Step 39-40 - PIM Page Objects + first PIM tests Sprint review prep

---

## Definition of Done for Sprint 1

- [] All committed stories automated and passing
- [] Tests pass in CI pipeline on chromium
- [] Allure report shows gree for Sprint 1 tests
- [] Page Objects created for Login + Employee pages
- [] No new flaky tests introduced
- [] All Jira tickets moved to Done
- [] Sprint review demo prepared
- [] Sprint retrospective completed

---

_Sprint 1 Planning - HRMSForge Project_
_Engineer: Sohail Ahmed Mohammed_
