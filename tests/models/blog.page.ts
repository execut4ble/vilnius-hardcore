import { expect, type Locator, type Page } from "@playwright/test";

export class BlogPage {
  readonly page: Page;
  readonly linkPost: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkPost = page.locator("ul.postList post h2.title a");
  }

  async openFirstPost() {
    await this.linkPost.first().click();
    const postUrl = await this.linkPost.first().getAttribute("href");
    await expect(this.page).toHaveURL(postUrl as string);
  }
}
