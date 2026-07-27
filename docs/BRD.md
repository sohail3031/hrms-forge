# Business Requirements Document (BRD)

## Document Control

| Field          | Details                                        |
| -------------- | ---------------------------------------------- |
| Document Title | Business Requirements Document                 |
| Project Name   | HRMSForge — OrangeHRM QA Automation Framework  |
| Version        | 1.0                                            |
| Status         | Approved                                       |
| Prepared By    | Sohail Ahmed Mohammed — QA Automation Engineer |
| Date           | Sprint 0                                       |

---

## 1. Executive Summary

The organization requires a production-grade, enterprise-level QA
automation framework for the OrangeHRM Human Resource Management System.

This framework will:

- Replace manual regression testing processes
- Reduce release cycle time
- Improve defect detection rates
- Serve as a reusable automation asset across future sprints

---

## 2. Business Objectives

| ID     | Objective                                     | Priority | Success Metric                              |
| ------ | --------------------------------------------- | -------- | ------------------------------------------- |
| BO-001 | Reduce manual regression effort by 70%        | Critical | Regression suite runs fully automated in CI |
| BO-002 | Achieve 90%+ coverage of critical workflows   | High     | Coverage report published per sprint        |
| BO-003 | Detect defects before production              | Critical | Zero Sev-1 bugs escape to production        |
| BO-004 | Enable continuous testing in CI/CD            | High     | Tests run on every PR and nightly           |
| BO-005 | Provide real-time reporting to stakeholders   | Medium   | Allure dashboard accessible post-run        |
| BO-006 | Establish reusable framework for future SDETs | Medium   | New engineer productive within 1 week       |

---

## 3. Business Rules

| ID     | Rule                                                           |
| ------ | -------------------------------------------------------------- |
| BR-001 | Only authenticated users may access beyond the login page      |
| BR-002 | Admin users can create, modify, and delete all system entities |
| BR-003 | ESS users can only view and modify their own personal data     |
| BR-004 | Leave requests require manager approval before status changes  |
| BR-005 | Employee IDs must be unique across the system                  |
| BR-006 | Mandatory fields must be validated on form submission          |
| BR-007 | Session must expire after defined inactivity period            |
| BR-008 | Deleted employees cannot be restored — soft delete only        |
| BR-009 | File uploads must not exceed 1MB in size                       |
| BR-010 | Reports must be exportable in CSV and PDF formats              |

---

## 4. Stakeholders

| Role            | Responsibility                         |
| --------------- | -------------------------------------- |
| Product Owner   | Define priorities, accept stories      |
| QA Lead         | Review test strategy, approve coverage |
| SDET            | Design and build automation framework  |
| Dev Lead        | API contracts, dev environment support |
| Scrum Master    | Facilitate agile ceremonies            |
| DevOps Engineer | CI/CD pipeline, Docker, secrets        |

---

## 5. Assumptions

| ID    | Assumption                                            |
| ----- | ----------------------------------------------------- |
| A-001 | OrangeHRM demo environment remains accessible         |
| A-002 | API contracts will not change during sprint execution |
| A-003 | Admin credentials remain valid and functional         |
| A-004 | Team has access to GitHub and GitHub Actions runners  |
| A-005 | Node.js 20 LTS is available on all machines           |
| A-006 | Docker is available for containerized test execution  |
| A-007 | Allure report server or GitHub Pages available        |

---

## 6. Dependencies

| ID    | Dependency                         | Owner       | Risk   |
| ----- | ---------------------------------- | ----------- | ------ |
| D-001 | OrangeHRM demo server availability | Third Party | Medium |
| D-002 | GitHub Actions minutes/quota       | DevOps      | Low    |
| D-003 | Allure CLI installation in CI      | DevOps      | Low    |
| D-004 | Node.js, npm packages availability | Developer   | Low    |
| D-005 | Docker Hub image availability      | DevOps      | Low    |

---

## 7. Constraints

| ID    | Constraint                            | Impact                               |
| ----- | ------------------------------------- | ------------------------------------ |
| C-001 | Cannot modify application source code | Must work around known limitations   |
| C-002 | Shared demo environment               | Must implement robust setup/teardown |
| C-003 | No database access                    | Must rely on API + UI assertions     |
| C-004 | Demo resets periodically              | Must design stateless tests          |
| C-005 | Free GitHub Actions limits            | May need to optimize pipeline        |

---

## 8. Risk Analysis

| Risk ID | Risk                                 | Probability | Impact | Mitigation                             |
| ------- | ------------------------------------ | ----------- | ------ | -------------------------------------- |
| R-001   | Demo environment goes down during CI | Medium      | High   | Retry strategy, skip gracefully        |
| R-002   | Demo resets mid-test-run             | High        | High   | Global setup recreates test data       |
| R-003   | Other users corrupt shared state     | Medium      | Medium | Use unique timestamps in test data     |
| R-004   | OrangeHRM changes UI selectors       | Low         | High   | Use data-testid, semantic selectors    |
| R-005   | API contract changes break tests     | Low         | Medium | Schema validation — contract tests     |
| R-006   | Flaky tests reduce CI confidence     | Medium      | High   | Retry, quarantine, root cause analysis |
| R-007   | GitHub Actions limits exceeded       | Low         | Medium | Optimize suite, use sharding           |

---

## 9. Application Under Test

| Property    | Details                                                        |
| ----------- | -------------------------------------------------------------- |
| Application | OrangeHRM HRMS                                                 |
| URL         | https://opensource-demo.orangehrmlive.com                      |
| API         | https://opensource-demo.orangehrmlive.com/web/index.php/api/v2 |
| Type        | Enterprise SaaS — HR Management                                |
| Frontend    | Vue.js SPA                                                     |
| Backend     | PHP (Symfony)                                                  |
| Database    | MySQL                                                          |
| Auth        | Session-based + JWT                                            |

---

## 10. Modules in Scope

| Module         | Functionality                                    |
| -------------- | ------------------------------------------------ |
| Authentication | Login, logout, session, password reset           |
| PIM            | Employee directory, CRUD, search, filter         |
| Leave          | Leave types, entitlement, apply, approve, reject |
| Admin          | User management, job titles, locations           |
| Dashboard      | Widgets, quick actions                           |
| Directory      | Employee search, org chart                       |
| Reports        | Generate, export CSV/PDF                         |

---

## 11. Out of Scope

| Item                          | Reason                         |
| ----------------------------- | ------------------------------ |
| Backend database verification | No DB access in demo           |
| Email/SMTP workflow           | No email server configured     |
| Payroll module                | Insufficient test data support |
| Mobile native app             | No native app available        |
| Full penetration testing      | Outside QA automation scope    |

---

_Document Version 1.0 — HRMSForge Project_
_Prepared by: Sohail Ahmed Mohammed — QA Automation Engineer_
