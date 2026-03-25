import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly sidebarBrand: Locator;
  readonly navAdmin: Locator;
  readonly navListUsers: Locator;
  readonly navSendMessage: Locator;
  readonly sidebarToggle: Locator;


  constructor(page: Page) {

 // ==================== Static Locators ==================== 
    this.page = page;
    this.sidebarBrand = page.getByRole('link', { name: 'COVA-dev' })
    this.navAdmin = page.getByRole('link', { name: 'Admin' })
    this.navListUsers = page.getByRole('link', { name: 'List Users' }),
    this.navSendMessage = page.getByRole('link', { name: 'Send Message' }),
    this.sidebarToggle = page.locator('#sidebarToggle')
  }

  async verifySideBar(): Promise<void> {
    await expect(this.sidebarBrand).toBeVisible();
    await expect(this.navAdmin).toBeVisible();
    await expect(this.navListUsers).toBeVisible();
    await expect(this.navSendMessage).toBeVisible();
    await expect(this.sidebarToggle).toBeVisible();
  }

  async navigateToAdmin(): Promise<void> {
    await this.navAdmin.click();
    await expect(this.page.url()).toContain('/admin.php');
  }

  async navigateToListUsers(): Promise<void> {
    await this.navListUsers.click();
    await expect(this.page.url()).toContain('/list_users.php');
  }

  async navigateToSendMessage(): Promise<void> {
    await this.navSendMessage.click();
    await expect(this.page.url()).toContain('/send_message.php');
  }

  async toggleSideBar(): Promise<void> {
    await this.sidebarToggle.click();
    await expect(this.page.url()).toContain('/');
  }
}