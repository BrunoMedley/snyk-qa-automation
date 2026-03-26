import { Page, Locator, expect } from '@playwright/test';

export class UserListPage {
  readonly page: Page;
  readonly usersTable: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usersTable = page.locator('#dataTable');
    this.tableHeaders = page.locator('#dataTable thead th');
    this.tableRows = page.locator('#dataTable tbody tr:not(:has(td.dataTables_empty))');
  }

  async verifyUserListLoaded(): Promise<void> {
    await expect(this.usersTable).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async getVisibleUserCount(): Promise<number> {
    return this.tableRows.count();
  }

  private async getColumnIndex(columnName: string): Promise<number> {
    const headers = await this.tableHeaders.allTextContents();
    return headers.findIndex((header) =>
      header.trim().toLowerCase().includes(columnName.toLowerCase())
    );
  }

  private async getCellTextByColumn(row: Locator, columnName: string, fallbackIdx: number): Promise<string> {
    const colIdx = await this.getColumnIndex(columnName);
    const idx = colIdx >= 0 ? colIdx : fallbackIdx;
    return (await row.locator('td').nth(idx).innerText()).trim();
  }

  async getFirstUserDetails(): Promise<{ name: string; age: string; startDate: string; salary: string }> {
    const firstRow = this.tableRows.first();
    await expect(firstRow).toBeVisible();

    const name = await this.getCellTextByColumn(firstRow, 'name', 0);
    const age = await this.getCellTextByColumn(firstRow, 'Age', 1);
    const startDate = await this.getCellTextByColumn(firstRow, 'Start date', 2);
    const salary = await this.getCellTextByColumn(firstRow, 'Salary', 3);

    return { name, age, startDate, salary };
  }

  async expectAllRowsContain(searchTerm: string): Promise<void> {
    const count = await this.getVisibleUserCount();
    for (let i = 0; i < count; i++) {
      await expect(this.tableRows.nth(i)).toContainText(new RegExp(searchTerm, 'i'));
    }
  }

  async expectUserWithDetails(details: { name: string; age: string; startDate: string; salary: string }): Promise<void> {
    const row = this.tableRows.filter({ hasText: details.name }).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText(details.name);
    await expect(row).toContainText(details.age);
    await expect(row).toContainText(details.startDate);
    await expect(row).toContainText(details.salary);
  }
}