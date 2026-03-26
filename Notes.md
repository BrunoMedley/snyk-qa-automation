# Framework and Rationale

Playwright offers many powerful features out of the box, including:

- Detailed reports
- Parallelization
- Cross-browser support
- Storage state for handling logins and authentication
- Smart automatic waits

**Key advantages I experienced:**

- Debugging is very user-friendly
- Excellent speed compared to other frameworks I've used
- Highly stable with significantly fewer flaky tests
- Battle-tested by the QA community
- Actively maintained with frequent updates and rapidly growing adoption
- It was one of the allowed options in this challenge, and I personally wanted to try it


# High-level Test Strategy

## Test Levels and Approach

- **Primary layer: E2E UI automation**
  - Use Playwright + TypeScript for realistic user workflows against the configured environment (`BASE_URL`).
  - Follow the Page Object Model (`pages/`, `components/`) to improve maintainability and reduce selector duplication.
  - `pages/` contain only locators and actions from that page
  - `components/` is for shared ui parts like sidebar and navbar
- **Suite segmentation by intent**
  - Smoke: smallest critical path checks for rapid signal.
  - Tag-driven execution enables selective runs 
  - Scope driven executation ex: tests/e2e

## Environments and Data

- Run tests against a stable, representative test environment configured via `env/.env.dev`.
- Prepared to scale to multiple enviorments env.staging, env.prod
- Did not create a static data set as i did not see the point for the challenge but is a valid open point to discuss.
- Manage test credentials through environment variables (`USER_EMAIL`, `USER_PASSWORD`).
- Keep test data deterministic to minimize flaky outcomes.
- independent test cases that do not depend on execution order.

## Cross-Browser Strategy

- Baseline execution across `chromium`, `firefox`, and `webkit` where supported.
- On unsupported macOS ARM setups, `webkit` is intentionally skipped by config to avoid false infrastructure failures.


## Observability and Reporting

- Use Playwright HTML report as the primary execution report.
- Capture:
  - Trace on first retry.
  - Screenshot on failure.
  - Video retained on failure.
- Attach report/artifacts to CI runs to support asynchronous debugging.

# Detailed Test Cases

## Task 1: Login and Authentication Scenarios

| Test Case ID | Scenario | Steps | Expected Result | Tags |
| --- | --- | --- | --- | --- |
| TC-AUTH-01 | Successful login with valid credentials | 1. Open app login page. 2. Click login link. 3. Enter valid `USER_EMAIL` and `USER_PASSWORD`. 4. Submit form. | User is authenticated and redirected to admin/user list area (`admin.php`). | `@smoke @auth` |
| TC-AUTH-02 | Invalid password for existing user | 1. Open login page. 2. Enter valid username and wrong password. 3. Submit form. | Password error message is displayed and login does not proceed. | `@auth @negative` |
| TC-AUTH-03 | Non-existent username | 1. Open login page. 2. Enter unknown username and valid password. 3. Submit form. | "User not found" style error is shown and includes attempted username. | `@auth @negative` |
| TC-AUTH-04 | Empty form submission validation | 1. Open login form. 2. Click submit with empty username/password. | Required-field HTML5 validation appears; username field receives focus first. | `@auth @validation` |

## Task 2: User Listing and Search Scenarios

| Test Case ID | Scenario | Steps | Expected Result | Tags |
| --- | --- | --- | --- | --- |
| TC-USERS-01 | User list page loads correctly | 1. Login with valid credentials. 2. Navigate to "List Users". | Users table is visible and user count is greater than 0. | `@smoke @users` |
| TC-USERS-02 | Validate sample user row data integrity | 1. Open user list page. 2. Capture first row details (`name`, `age`, `start date`, `salary`). 3. Assert values are non-empty and row can be located by same values. | Captured row details are valid and consistently rendered in the table. | `@users` |
| TC-USERS-03 | Search by full name | 1. Capture an existing full name from table. 2. Search by full name. | Exactly one matching row is shown and row contains expected user details. | `@users @search` |
| TC-USERS-04 | Search by partial name | 1. Capture existing name. 2. Use first 2-3 characters in search. | Filtered results are greater than 0 and every visible row contains the partial string. | `@users @search` |
| TC-USERS-05 | Search by non-existent name | 1. Generate unique random input. 2. Search with that value. | No rows are displayed (empty result state). | `@users @search @negative` |




#BONUS Challenge: Critical QA Eye

 - Have unique stable locators specific for test automation like a data-testid = '' would increase greatly the ease and speed of automation but also reduce flakyness
 - feedback messages being standarized across the aplication this would also help with speed of automation and flakyness
 - Pagination on the user list
 - APIs