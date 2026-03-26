import path from 'path';
import { test, expect } from '@playwright/test';
import { UserListPage } from '../../pages/UserListPage';
import { SideBar } from '../../components/SideBar';
import { NavBar } from '../../components/NavBar';

test.describe('User List and Search @users', () => {
  // Use the auth state generated once by `global.setup.ts`.
  const AUTH_STATE = path.resolve('playwright/.auth/user.json');
  test.use({ storageState: AUTH_STATE });

  let userListPage: UserListPage;
  let sideBar: SideBar;
  let navBar: NavBar;

  test.beforeEach(async ({ page }) => {
    sideBar = new SideBar(page);
    navBar = new NavBar(page);
    userListPage = new UserListPage(page);

    // `storageState` authenticates the session, but the sidebar only appears
    // on the admin page. Go there first, then navigate to the list page.
    await page.goto('/admin.php');
    await sideBar.navigateToListUsers();
    await userListPage.verifyUserListLoaded();
  });

  test('user list page loads and displays sample user details @smoke @users', async () => {
    // 1. Table should be visible
    await expect(userListPage.usersTable).toBeVisible();

    // 2. Total users should be greater than 0
    const totalUsers = await userListPage.getVisibleUserCount();
    expect(totalUsers).toBeGreaterThan(0);

    // 3. Get real data from the first row
    const sampleUser = await userListPage.getFirstUserDetails();

    // 4. Verify the data is not empty
    expect(sampleUser.name).not.toEqual('');
    expect(sampleUser.age).not.toEqual('');
    expect(sampleUser.startDate).not.toEqual('');
    expect(sampleUser.salary).not.toEqual('');

    // 5. Verify the user data is correct
    await userListPage.expectUserWithDetails(sampleUser);

    
    console.log('[assert] expectUserWithDetails', {
      name: sampleUser.name,
      age: sampleUser.age,
      startDate: sampleUser.startDate,
      salary: sampleUser.salary,
    });
  });

  test('search by full name shows matching user(s) @users @search', async () => {
    // 1. Get real data from the first row  
    const sampleUser = await userListPage.getFirstUserDetails();

    // 2. Search by full name
    await navBar.searchUser(sampleUser.name);

    // 3. Verify the user is visible
    await expect(userListPage.tableRows.first()).toBeVisible();

    // 4. Verify the number of users is 1
    expect(await userListPage.getVisibleUserCount()).toBe(1);

    // 5. Verify the user is in the table
    await userListPage.expectAllRowsContain(sampleUser.name);

  });

  test('search by partial name shows users containing partial input @users @search', async () => {
    // 1. Get real data from the first row
    const sampleUser = await userListPage.getFirstUserDetails();

    // 2. Search by partial name
    const partialName = sampleUser.name.trim().slice(0, Math.min(3, sampleUser.name.trim().length));

    await navBar.searchUser(partialName);

    // 3. Verify the number of users is greater than 0
    const count = await userListPage.getVisibleUserCount();
    expect(count).toBeGreaterThan(0);

    // 4 Verify that all the users present contain the partial name
    await userListPage.expectAllRowsContain(partialName);
  });

  test('search with non-existent name shows no results state @users @search ', async () => {
    // 1. Generate a random name
    const randomName = `no-user-${Date.now()}`; 

    // 2. Search by random name
    await navBar.searchUser(randomName);

    // 3. Verify the number of users is 0
    expect(await userListPage.getVisibleUserCount()).toBe(0);
        
  });
});