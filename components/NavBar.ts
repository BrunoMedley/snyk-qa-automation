import { Page, Locator, expect } from '@playwright/test';

export class NavBar {
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
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutLink.click();
    await expect(this.logoutConfirmBtn).toBeVisible();
    await this.logoutConfirmBtn.click();
    await expect(this.page.url()).toContain('/');
  }

  async searchUser(term: string): Promise<void> {
    await this.searchUserInput.clear();
    await this.searchUserInput.fill(term);
    await this.searchUserBtn.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.url()).toContain('/list_users.php?search=');
  }

  async searchAllUsers(): Promise<void> {
    await this.searchUserBtn.click();
    await expect(this.page.url()).toContain('/list_users.php?search=');
  }
}

export default NavBar;