# Bug Reports

## Document Control

| Field          | Details                                        |
| -------------- | ---------------------------------------------- |
| Document Title | Bug Reports                                    |
| Project Name   | HRMSForge — OrangeHRM QA Automation Framework  |
| Version        | 1.0                                            |
| Prepared By    | Sohail Ahmed Mohammed — QA Automation Engineer |
| Total Bugs     | 25                                             |

---

## Bug Summary

| Severity  | Count  |
| --------- | ------ |
| Critical  | 4      |
| High      | 11     |
| Medium    | 7      |
| Low       | 3      |
| **Total** | **25** |

---

## BUG-001

Bug ID: BUG-001
Title: Error message not displayed for empty credentials
Severity: Medium
Priority: High
Module: Authentication
Environment: Chrome 120, Windows 11, OrangeHRM Demo
Test Case: TC-AUTH-006
Status: Open

Steps to Reproduce:

Navigate to login page
Leave Username field empty
Leave Password field empty
Click Login button

Expected Result:
Validation error messages appear on both Username
and Password fields without making an API call.

Actual Result:
[To be confirmed during test execution]

Root Cause Hypothesis:
Client-side validation may not fire on initial submit

Attachments:

screenshot-bug-001-empty-form.png

---

## BUG-002

Bug ID: BUG-002
Title: Duplicate Employee ID accepted intermittently
Severity: Critical
Priority: Critical
Module: PIM
Environment: Chrome 120, OrangeHRM Demo
Test Case: TC-PIM-003
Status: Open

Steps to Reproduce:

Log in as Admin
Note the Employee ID of an existing employee
Navigate to PIM > Add Employee
Enter different name but same Employee ID
Click Save

Expected Result:
Error: "Employee Id already exists"

Actual Result:
[Intermittent — suspected acceptance of duplicate IDs]

Root Cause Hypothesis:
Race condition between reset script and validation
OR validation only fires on blur not on submit

Attachments:

screenshot-bug-002-duplicate-id.png
network-bug-002-post-request.png

---

## BUG-003

Bug ID: BUG-003
Title: Session persists after browser tab close
Severity: High
Priority: High
Module: Authentication / Security
Environment: Chrome 120
Test Case: TC-AUTH-010
Status: Open

Steps to Reproduce:

Log in as Admin
Close the browser tab without logging out
Reopen the application URL in a new tab

Expected Result:
Session expires or user prompted to re-authenticate

Actual Result:
User remains logged in — session persists via cookie

Security Impact:
HIGH — On shared computers, previous user session
accessible to next user

Attachments:

screenshot-bug-003-cookie-inspection.png

---

## BUG-004

Bug ID: BUG-004
Title: Search results not cleared when field emptied
Severity: Low
Priority: Medium
Module: PIM
Environment: Chrome 120
Test Case: TC-PIM-029
Status: Open

Steps to Reproduce:

Log in as Admin > PIM > Employee List
Enter a name in search > Click Search
Results filtered to matching employees
Clear the search field manually
Observe results without clicking Reset

Expected Result:
Results update or remain stable pending Reset click

Actual Result:
Field visually empty but previous filter still applied

Attachments:

screenshot-bug-004-stale-filter.png

---

## BUG-005

Bug ID: BUG-005
Title: File upload accepts .exe without validation
Severity: High
Priority: High
Module: PIM
Environment: Chrome 120
Test Case: TC-PIM-017
Status: Open

Steps to Reproduce:

Log in as Admin > PIM > Employee profile
Click on profile photo area
Upload a file with .exe extension
Click Save

Expected Result:
Validation error: "Invalid file type"

Actual Result:
[To be confirmed — suspected missing client validation]

Security Impact:
HIGH — Accepting executables enables malicious storage

Attachments:

screenshot-bug-005-exe-upload.png
network-bug-005-upload-request.png

---

## BUG-006

Bug ID: BUG-006
Title: Leave apply allows weekend-only date range
Severity: Medium
Priority: Medium
Module: Leave Management
Environment: Chrome 120
Test Case: TC-LVE-005
Status: Open

Steps to Reproduce:

Log in as ESS user > Leave > Apply
Select Saturday as start date
Select Sunday as end date
Submit leave request

Expected Result:
Warning or rejection for non-working day selection

Actual Result:
Leave request accepted for weekend dates

Attachments:

screenshot-bug-006-weekend-leave.png

---

## BUG-007

Bug ID: BUG-007
Title: Password field accepts unlimited characters
Severity: Low
Priority: Low
Module: Authentication
Environment: Chrome 120
Test Case: TC-AUTH-011
Status: Open

Steps to Reproduce:

Navigate to login page
Paste 10,000+ characters into Password field

Expected Result:
Field enforces reasonable max length (e.g. 64 chars)

Actual Result:
[To be confirmed — may accept unlimited input]

Attachments:

screenshot-bug-007-long-password.png

---

## BUG-008

Bug ID: BUG-008
Title: No loading indicator during slow employee search
Severity: Low
Priority: Low
Module: PIM
Environment: Chrome 120, Slow 3G throttled
Test Case: TC-PIM-007
Status: Open

Steps to Reproduce:

Enable Slow 3G in Chrome DevTools
Log in as Admin > PIM > Employee List
Click Search

Expected Result:
Loading spinner shown during API call

Actual Result:
No indicator — table appears frozen during load

Attachments:

screenshot-bug-008-no-spinner.png

---

## BUG-009

Bug ID: BUG-009
Title: Logout does not invalidate server-side session
Severity: High
Priority: High
Module: Authentication / Security
Environment: Chrome 120, Postman
Test Case: TC-AUTH-010
Status: Open

Steps to Reproduce:

Log in as Admin
Copy session cookie from DevTools
Log out via UI
Send GET /api/v2/pim/employees with copied cookie

Expected Result:
API returns 401 Unauthorized

Actual Result:
[To be confirmed — potential server-side persistence]

Security Impact:
CRITICAL — Stolen tokens usable after logout

Attachments:

screenshot-bug-009-postman-old-token.png

---

## BUG-010

Bug ID: BUG-010
Title: Special characters in name cause display issue
Severity: Medium
Priority: Medium
Module: PIM
Environment: Chrome 120
Test Case: TC-PIM-030
Status: Open

Steps to Reproduce:

Add employee with First Name: O'Brien
Save and view employee list

Expected Result:
Name displays correctly: O'Brien

Actual Result:
[May display as O'Brien or similar encoded form]

Attachments:

screenshot-bug-010-encoded-name.png

---

## BUG-011

Bug ID: BUG-011
Title: Browser back shows cached page after logout
Severity: High
Priority: High
Module: Authentication / Security
Environment: Chrome 120
Test Case: TC-AUTH-010
Status: Open

Steps to Reproduce:

Log in as Admin, navigate to Employee List
Log out via UI
Press browser Back button

Expected Result:
Redirect to login — no cached content shown

Actual Result:
[May show cached Employee List page]

Security Impact:
Sensitive data visible to anyone with physical access

Attachments:

screenshot-bug-011-cached-page.png

---

## BUG-012

Bug ID: BUG-012
Title: XSS payload accepted in leave comment field
Severity: High
Priority: High
Module: Leave / Security
Environment: Chrome 120
Test Case: TC-LVE-001
Status: Open

Steps to Reproduce:

Log in as ESS user > Apply for leave
Enter <img src=x onerror=alert('XSS')> in comment
Submit
Manager views the leave request

Expected Result:
Payload rendered as plain text — no script executes

Actual Result:
[To be confirmed — potential stored XSS]

Security Impact:
CRITICAL — Session hijacking, account compromise

Attachments:

screenshot-bug-012-xss-payload.png
screenshot-bug-012-manager-view.png

---

## BUG-013

Bug ID: BUG-013
Title: No upload progress for large profile photos
Severity: Low
Priority: Low
Module: PIM
Environment: Chrome 120
Test Case: TC-PIM-015
Status: Open

Steps to Reproduce:

Upload profile photo close to 1MB limit
Observe during upload process

Expected Result:
Upload progress indicator displayed

Actual Result:
No progress — button appears unresponsive

Attachments:

screen-recording-bug-013-upload.mp4

---

## BUG-014

Bug ID: BUG-014
Title: ESS user can access Add Employee URL directly
Severity: Critical
Priority: Critical
Module: Security / Authorization
Environment: Chrome 120
Test Case: TC-PIM-001
Status: Open

Steps to Reproduce:

Log in as ESS user
Navigate directly to:
/web/index.php/pim/addEmployee

Expected Result:
Access denied — redirect to dashboard

Actual Result:
[To be confirmed — potential authorization bypass]

Security Impact:
CRITICAL — Unauthorized employee creation possible

Attachments:

screenshot-bug-014-ess-add-employee.png

---

## BUG-015

Bug ID: BUG-015
Title: Report export generates empty CSV
Severity: Medium
Priority: Medium
Module: Reports
Environment: Chrome 120
Status: Open

Steps to Reproduce:

Go to Reports
Leave date range empty
Click Export

Expected Result:
Report exported with all available data

Actual Result:
Empty CSV file downloaded

Attachments:

screenshot-bug-015-empty-csv.png

---

## BUG-016 through BUG-025 — Summary

| Bug ID  | Title                                         | Severity | Module          | Status |
| ------- | --------------------------------------------- | -------- | --------------- | ------ |
| BUG-016 | Column sort arrow shows wrong direction       | Low      | PIM             | Open   |
| BUG-017 | Dashboard time wrong after timezone change    | Medium   | Dashboard       | Open   |
| BUG-018 | Cannot unassign Job Title from employee       | Medium   | PIM             | Open   |
| BUG-019 | Search ignores leading/trailing whitespace    | Low      | PIM             | Open   |
| BUG-020 | Password reset link visible without SMTP      | Low      | Auth            | Open   |
| BUG-021 | Multi-delete shows wrong employee count       | Medium   | PIM             | Open   |
| BUG-022 | Leave balance shows negative after adjustment | High     | Leave           | Open   |
| BUG-023 | API returns 200 for missing required fields   | High     | API             | Open   |
| BUG-024 | Pagination resets on column sort change       | Low      | PIM             | Open   |
| BUG-025 | Login form overflows on 320px viewport        | Medium   | Auth/Responsive | Open   |

---

## Bug Tracking

All bugs are tracked in Jira under the HRMSForge project.

| Jira Filter   | Query                                                    |
| ------------- | -------------------------------------------------------- |
| All open bugs | project = HF AND issuetype = Bug AND status = Open       |
| Critical bugs | project = HF AND issuetype = Bug AND priority = Critical |
| Security bugs | project = HF AND issuetype = Bug AND labels = security   |

---

## Bug Evidence

Screenshots and screen recordings for each bug are stored in:
`/docs/bug-evidence/`

Named convention:

screenshot-bug-[ID]-[short-description].png
screen-recording-bug-[ID]-[description].mp4
network-bug-[ID]-[description].png

---

_Document Version 1.0 — HRMSForge Project_
_Prepared by: Sohail Ahmed Mohammed — QA Automation Engineer_
