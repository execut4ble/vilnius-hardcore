import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly inputUsername: Locator;
  readonly inputPassword: Locator;
  readonly btnLogin: Locator;
  readonly formLogin: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputUsername = page.locator("input[name='username']");
    this.inputPassword = page.locator("input[name='password']");
    this.btnLogin = page.locator("form[action='?/login'] > button");
    this.formLogin = page.locator("form[action='?/login']");
  }

  async login(username?: string, password?: string) {
    await this.inputUsername.fill(username as string);
    await this.inputPassword.fill(password as string);
    await this.btnLogin.click();
  }

  async verifyLoginFormIsVisible() {
    await expect(this.formLogin, "Login form should be visible").toBeVisible();
    await expect(this.inputUsername).toBeVisible();
    await expect(this.inputPassword).toBeVisible();
    await expect(this.inputPassword).toHaveAttribute("type", "password");
  }
}
