import { expect, type Locator, type Page } from "@playwright/test";

export class CrewPage {
  readonly page: Page;
  readonly inputUsername: Locator;
  readonly inputPassword: Locator;
  readonly btnRegister: Locator;
  readonly formRegister: Locator;
  readonly ctrUserInfo: Locator;
  readonly btnLogout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputUsername = page.locator("input[name='username']");
    this.inputPassword = page.locator("input[name='password']");
    this.btnRegister = page.locator("form[action='?/register'] > button");
    this.formRegister = page.locator("form[action='?/register']");
    this.ctrUserInfo = page.locator("section .userInfo");
    this.btnLogout = page.locator("form[action='?/logout'] > button");
  }

  async verifyPageElementsVisible() {
    await expect(this.ctrUserInfo).toBeVisible();
    await expect(this.btnLogout).toBeVisible();
  }
}
