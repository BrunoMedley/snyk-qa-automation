import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// Credentials from env (see playwright / .env setup)
const VALID_EMAIL = process.env.USER_EMAIL!;
const VALID_PASSWORD = process.env.USER_PASSWORD!;

test.describe('Login Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto(); // fresh login page each test
  });


  

  // Happy path: valid credentials land on admin
  test('successful login redirects to user list', async ({ page }) => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await expect(page).toHaveURL(/admin.php/);
    //ADD MORE VERIFICATIONS HERE
  });

  // Wrong password → app-specific error
  test('invalid password shows error', async () => {
    await loginPage.login(VALID_EMAIL, 'wrongpassword');
    await expect(loginPage.errorWrongPassword).toBeVisible();
  });

  // Unknown user → app-specific error
  test('non-existent user shows the typed username in error', async () => {
    const wrongUser = 'badUser';

    await loginPage.login(wrongUser, VALID_PASSWORD);
    await expect(loginPage.errorWrongUser(wrongUser)).toBeVisible();

  });

  // HTML5 validation on required fields
  test('empty fields show HTML5 validation messages', async ({ page }) => {
    await loginPage.clickwelcomeLoginLink();
    await loginPage.verifyLoginFormVisible();
    await loginPage.clickLogin(); // submit empty form
    await expect(loginPage.userNameInput).toBeFocused();
    await expect(await loginPage.getValidationMessage(loginPage.userNameInput)).toMatch(/Please fill (in|out) this field\./);
  });
});