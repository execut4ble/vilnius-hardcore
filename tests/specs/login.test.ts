import { test, expect } from "../fixtures";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

test.beforeEach(async ({ page }) => {
  await page.goto("/crew");
});

test("Login with valid credentials", async ({
  page,
  loginPage,
  crewPage,
  layout,
}) => {
  await expect(page).toHaveURL("crew/login");
  await loginPage.verifyLoginFormIsVisible();
  await loginPage.login(username, password);
  await expect(page).toHaveURL("crew");
  await crewPage.verifyPageElementsVisible();
  await expect(layout.ctrUserInfo, "should be logged in").toBeVisible();
});

test("Login with invalid credentials", async ({ page, loginPage, layout }) => {
  await expect(page).toHaveURL("crew/login");
  await loginPage.verifyLoginFormIsVisible();
  await loginPage.login("", "");
  await expect(page).toHaveURL("crew/login");
  await expect(
    page.locator("p.field-error"),
    "Error message should be visible",
  ).toBeVisible();
  await expect(layout.ctrUserInfo, "Should not be logged in").not.toBeVisible();
});

test("Login and logout with valid credentials", async ({
  page,
  loginPage,
  crewPage,
  layout,
}) => {
  await expect(page).toHaveURL("crew/login");
  await loginPage.verifyLoginFormIsVisible();
  await loginPage.login(username, password);
  await expect(page).toHaveURL("crew");
  await crewPage.verifyPageElementsVisible();
  await expect(layout.ctrUserInfo, "Should be logged in").toBeVisible();
  await crewPage.btnLogout.click();
  await expect(page).toHaveURL("crew/login");
  await expect(layout.ctrUserInfo, "Should not be logged in").not.toBeVisible();
});
