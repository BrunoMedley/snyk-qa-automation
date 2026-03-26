# Snyk QA Automation

Playwright + TypeScript end-to-end test automation for login and user listing/search flows.

## Features

- Playwright test framework with TypeScript support.
- Environment-based config using `dotenv` (`env/.env.dev`).
- Cross-browser projects:
  - `chromium`
  - `firefox`
  - `webkit` (auto-disabled on unsupported macOS ARM setups)
- Test tagging for focused runs:
  - `@smoke`
  - `@auth`
  - `@users`
  - `@search`
  - `@negative`
  - `@validation`
- HTML test reporting with retries/traces/screenshots/videos on failures.
- Page Object Model structure (`pages/` + `components/`).

## Project Structure

- `tests/e2e/` - End-to-end specs.
  - `login.spec.ts` - Login/authentication scenarios.
  - `listUsers.spec.ts` - User list and search scenarios.
- `pages/` - Page objects (`LoginPage`, `UserListPage`).
- `components/` - Reusable UI components (`NavBar`, `SideBar`).
- `env/.env.dev.example` - Example environment variables.
- `playwright.config.ts` - Playwright and environment loading config.

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+

## Setup

1) Install dependencies:

```bash
npm install
```

2) Install Playwright browsers:

```bash
npx playwright install
```

3) Create your local environment file:

```bash
cp env/.env.dev.example env/.env.dev
```

4) Update `env/.env.dev` with real values:

```env
BASE_URL=http://localhost:8080
USER_EMAIL=your-test-user@example.com
USER_PASSWORD=your-test-password
TIMEOUT=3000
```

> `BASE_URL` is required. Test execution will fail if it is missing.

## Running Tests

### Main Commands

```bash
# Run all tests
npm test

# Run all tests (alias)
npm run test:all

# Run with Playwright interactive UI mode
npm run test:ui

# Run headed mode (visible browser)
npm run test:headed
```

### Browser-Specific Runs

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Suite and Tag-Based Runs

```bash
# Run only e2e folder
npm run test:e2e

# Run smoke tests
npm run test:smoke

# Run smoke tests in Playwright UI mode
npm run test:smoke:ui

# Run only auth/login related tests
npm run test:auth

# Run only user list/search related tests
npm run test:users

# Run only search related tests
npm run test:search

# Run negative scenarios
npm run test:negative

# Run everything except smoke
npm run test:regression
```

## Reports and Debugging

This project generates HTML reports in `playwright-report/`.

After running tests:

```bash
npx playwright show-report
```

On failures, Playwright is configured to capture:

- Trace: `on-first-retry`
- Screenshot: `only-on-failure`
- Video: `retain-on-failure`

## Notes

- `playwright.config.ts` loads env files in this order (first existing file found):
  - `env/.env.dev`
  - `.env.dev`
  - `.env`
- In CI:
  - `forbidOnly` is enabled
  - retries are set to `2`
  - workers are set to `4`

## Troubleshooting

- **Error: `BASE_URL is not set`**
  - Ensure `env/.env.dev` exists and includes `BASE_URL`.
- **Browser missing errors**
  - Run: `npx playwright install`
- **No tests matched tag filters**
  - Confirm tags in spec names are correct (for example `@smoke`, `@auth`, `@users`).
