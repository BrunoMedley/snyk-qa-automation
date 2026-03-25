import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly LoginButton: Locator;
  readonly errorWrongPassword: Locator;
  readonly welcomeLoginLink: Locator;


  constructor(page: Page) {

 // ==================== Static Locators ==================== 
    this.page = page;
    this.welcomeLoginLink = page.locator('#link-login');
    this.userNameInput = page.locator('#username');         
    this.passwordInput = page.locator('#password');
    this.LoginButton = page.locator('button[type="submit"]');
    this.errorWrongPassword = page.locator('.card.bg-danger').getByText('Wrong Password');
  }

  // ==================== Dynamic Locators ====================
  errorWrongUser(username: string): Locator {
    return this.page
      .locator('.card.bg-danger')
      .filter({ hasText: `User "${username}" does not exist` });
  }
    

    // ==================== Login Page Actions  ====================


  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    
  }

  async clickwelcomeLoginLink(): Promise<void> {
    await this.welcomeLoginLink.waitFor({ state: 'visible' });
    await this.welcomeLoginLink.click();
  }

  async fillUsername(username: string): Promise<void> {
    await this.userNameInput.waitFor({ state: 'visible' });
    await this.userNameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.LoginButton.waitFor({ state: 'visible' });
    await this.LoginButton.click();
  }

//complete login process
  async login(username: string, password: string): Promise<void> {
    await this.clickwelcomeLoginLink(); 
    await this.verifyLoginFormVisible();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  // verify login form is visible
  async verifyLoginFormVisible(): Promise<void> {
    await expect(this.userNameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.LoginButton).toBeVisible();
  }

  //clear user and password input fields
  async clearForm(): Promise<void> {
    await this.userNameInput.clear();
    await this.passwordInput.clear();
  }


  async getValidationMessage(field: Locator): Promise<string> {
    return field.evaluate((element) => (element as HTMLInputElement).validationMessage);
  }
}