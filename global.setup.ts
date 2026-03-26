import fs from 'fs';
import path from 'path';
import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

async function globalSetup(config: FullConfig) {
  // `globalSetup` is executed outside the Playwright test runner, so we can't rely on
  // the `use.baseURL` fixture. Build the URL explicitly.
  const baseURL =
    process.env.BASE_URL ?? ((config.projects?.[0]?.use as { baseURL?: string } | undefined)?.baseURL ?? undefined);
  if (!baseURL) {
    throw new Error(
      'BASE_URL is not set. Add it to env/.env.dev or a root .env file, or export it before running tests.',
    );
  }

  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;
  if (!userEmail || !userPassword) {
    throw new Error('USER_EMAIL and USER_PASSWORD must be set to generate auth state.');
  }

  const authStatePath = path.resolve('playwright/.auth/user.json');
  fs.mkdirSync(path.dirname(authStatePath), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    const loginPage = new LoginPage(page);

    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');

    await loginPage.login(userEmail, userPassword);

    // Wait for the authenticated landing page before saving auth state.
    // Otherwise, we may persist a "not fully logged in yet" session.
    await page.waitForURL(/admin\.php/, { timeout: 30_000 });

    // Save auth state once (reused by tests via `storageState`).
    await page.context().storageState({ path: authStatePath });
  } finally {
    await browser.close();
  }
}

export default globalSetup;