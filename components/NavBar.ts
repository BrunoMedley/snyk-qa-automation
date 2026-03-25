import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly searchUserInput: Locator;
  readonly searchUserBtn: Locator;
  readonly userDropdown: Locator;
  readonly userProfile: Locator;
  readonly logoutLink: Locator;
  readonly logoutCancelBtn: Locator;
  readonly logoutConfirmBtn: Locator;


  constructor(page: Page) {

 // ==================== Static Locators ==================== 
    this.page = page;
    this.searchUserInput = page.locator('form.navbar-search').first().locator('input[name="search"]');
    this.searchUserBtn = page.locator('form.navbar-search').first().locator('button[type="submit"]');
    this.userDropdown = page.locator('#userDropdown');
    this.userProfile = page.locator('.dropdown-item:has(.fa-user)');
    this.logoutLink = page.locator('#logoutModal');
    this.logoutCancelBtn = page.locator('#logoutModal .btn-secondary');
    this.logoutConfirmBtn = page.locator('#logoutModal a.btn-primary');
  }

  async verifyNavBar(): Promise<void> {
    await expect(this.searchUserInput).toBeVisible();
    await expect(this.searchUserBtn).toBeVisible();
    await expect(this.userDropdown).toBeVisible();
    await expect(this.userProfile).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    await expect(this.logoutCancelBtn).toBeVisible();
    await expect(this.logoutConfirmBtn).toBeVisible();
  }
}