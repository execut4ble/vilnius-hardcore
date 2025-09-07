import { type Locator, type Page } from "@playwright/test";

export class Layout {
  readonly page: Page;
  readonly labelRecentComments: Locator;
  readonly ctrUserInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ctrUserInfo = page.locator("sidebar .userInfo");
    this.labelRecentComments = page.locator(".recentComments li.comment");
  }
}
