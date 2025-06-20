import { expect, test } from "@playwright/test";
import { LoginPage } from "../models/login.page";
import { CrewPage } from "../models/crew.page";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

test.beforeEach(async ({ page }) => {
  await page.goto("/crew");
});

test("Login with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const crewPage = new CrewPage(page);
  await expect(page).toHaveURL("crew/login");
  await loginPage.verifyLoginFormIsVisible();
  await loginPage.login(username, password);
  await expect(page).toHaveURL("crew");
  await crewPage.verifyPageElementsVisible();
  await expect(
    page.locator("sidebar .userInfo"),
    "should be logged in",
  ).toBeVisible();
});

test("Login with invalid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await expect(page).toHaveURL("crew/login");
  await loginPage.verifyLoginFormIsVisible();
  await loginPage.login("", "");
  await expect(page).toHaveURL("crew/login");
  await expect(
    page.locator("p.error"),
    "Error message should be visible",
  ).toBeVisible();
  await expect(
    page.locator("sidebar .userInfo"),
    "Should not be logged in",
  ).not.toBeVisible();
});

test("Login and logout with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const crewPage = new CrewPage(page);
  await expect(page).toHaveURL("crew/login");
  await loginPage.verifyLoginFormIsVisible();
  await loginPage.login(username, password);
  await expect(page).toHaveURL("crew");
  await crewPage.verifyPageElementsVisible();
  await expect(
    page.locator("sidebar .userInfo"),
    "Should be logged in",
  ).toBeVisible();
  await crewPage.btnLogout.click();
  await expect(page).toHaveURL("crew/login");
  await expect(
    page.locator("sidebar .userInfo"),
    "Should not be logged in",
  ).not.toBeVisible();
});
