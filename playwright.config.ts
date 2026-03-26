import fs from 'fs';
import os from 'os';
import path from 'path';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const resolveEnvDevPath = (): string | undefined => {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, 'env', '.env.dev'),
    path.resolve(cwd, '.env.dev'),
    path.resolve(cwd, '.env'),
    path.resolve(__dirname, 'env', '.env.dev'),
    path.resolve(__dirname, '..', 'env', '.env.dev'),
    path.resolve(__dirname, '..', '..', 'env', '.env.dev'),
  ];

  return candidates.find((p) => fs.existsSync(p));
};

const envDevPath = resolveEnvDevPath();
if (envDevPath) {
  dotenv.config({ path: envDevPath });
} else {
  // Fall back to default dotenv behavior (tries to load `.env` from cwd if present)
  dotenv.config();
}

const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error(
    'BASE_URL is not set. Add it to env/.env.dev or a root .env file, or export it before running tests.'
  );
}

const browserProjects = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
];

// WebKit is unavailable on some macOS ARM versions.
const isWebkitUnsupported = process.platform === 'darwin' && process.arch === 'arm64' && os.release().startsWith('22.');
if (!isWebkitUnsupported) {
  browserProjects.push({ name: 'webkit', use: { ...devices['Desktop Safari'] } });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : '100%',
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: browserProjects,
});
