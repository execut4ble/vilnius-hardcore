import { type Locator, type Page } from "@playwright/test";

export class Layout {
  readonly page: Page;
  readonly ctrUserInfo: Locator;
  readonly labelRecentComments: Locator;
  readonly errorPage: Locator;
  readonly menuNav: Locator;
  readonly ctrLocale: Locator;
  readonly tagHtml: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ctrUserInfo = page.locator("sidebar #user-info");
    this.labelRecentComments = page.locator("#recent-comments li.comment");
    this.errorPage = page.locator("div#error-page");
    this.menuNav = page.locator("sidebar div.menu nav");
    this.ctrLocale = page.locator("sidebar #locale");
    this.tagHtml = page.locator("html");
  }

  async switchLocale(locale: string) {
    await this.ctrLocale.getByRole("button", { name: locale }).click();
    await this.page.waitForLoadState("domcontentloaded");
  }
}
