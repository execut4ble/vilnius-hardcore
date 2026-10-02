import { expect, type Locator, type Page } from "@playwright/test";

export class BlogPage {
  readonly page: Page;
  readonly linkPost: Locator;
  readonly btnAddNewPost: Locator;
  readonly formPostEntry: Locator;
  readonly inputPostTitle: Locator;
  readonly inputPostContent: Locator;
  readonly btnSavePost: Locator;
  readonly btnEditPost: Locator;
  readonly labelItemCount: Locator;
  readonly btnShowMore: Locator;
  readonly btnDeletePost: Locator;
  readonly labelConfirmDelete: Locator;
  readonly btnConfirmDelete: Locator;
  readonly btnDeclineDelete: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkPost = page.locator("ul.item-list post h2.title a");
    this.btnAddNewPost = page.locator("button.new-post");
    this.formPostEntry = page.locator("form#add-post");
    this.inputPostTitle = page.locator("form#add-post input#title");
    this.inputPostContent = page.locator("form#add-post textarea#description");
    this.btnSavePost = page.locator("form#add-post button[type='submit']");
    this.btnEditPost = page.locator("post button#edit");
    this.btnDeletePost = page.locator("post button#delete");
    this.labelConfirmDelete = page.locator(
      "button#delete + span.confirm-dialog",
    );
    this.btnConfirmDelete = page.locator(
      "span.confirm-dialog > button[type='submit']",
    );
    this.btnDeclineDelete = page.locator(
      "span.confirm-dialog > button[type='button']",
    );
    this.labelItemCount = page.locator("div#item-total");
    this.btnShowMore = page.locator("button#load-more");
  }

  async getItemCount(): Promise<number> {
    return Number(
      ((await this.labelItemCount.textContent()) as string)
        .split("out of")
        .pop(),
    );
  }

  postItem(title: string): Locator {
    return this.page.locator("ul.item-list post").filter({ hasText: title });
  }

  private async revealPost(
    title: string,
    giveUpOnceAllShown = false,
  ): Promise<boolean> {
    const item = this.postItem(title);
    const allItems = this.page.locator("ul.item-list post");
    const deadline = Date.now() + (giveUpOnceAllShown ? 3_000 : 15_000);
    while (Date.now() < deadline) {
      if ((await item.count()) > 0) {
        return true;
      }
      if (await this.btnShowMore.isVisible()) {
        await this.btnShowMore.click({ timeout: 1_000 }).catch(() => {});
      } else if (giveUpOnceAllShown && (await allItems.count()) > 0) {
        return false;
      }
      await this.page.waitForTimeout(200);
    }
    return false;
  }

  async showPostByTitle(title: string) {
    expect(
      await this.revealPost(title),
      `post "${title}" was not found in the list`,
    ).toBe(true);
  }

  async openPostByTitle(title: string) {
    await this.showPostByTitle(title);
    const link = this.linkPost.filter({ hasText: title });
    const postUrl = await link.first().getAttribute("href");
    await link.first().click();
    await expect(this.page).toHaveURL(postUrl as string);
  }

  async openEditFormByTitle(title: string) {
    await this.showPostByTitle(title);
    await this.postItem(title).locator("button#edit").click();
    await expect(this.formPostEntry).toBeVisible();
  }

  async deletePostByTitle(title: string) {
    if (!(await this.revealPost(title, true))) {
      return;
    }
    await this.clickDeleteAndConfirm(title);
  }

  async createNewPost(title: string, content: string) {
    await this.btnAddNewPost.click();
    await expect(this.formPostEntry).toBeVisible();
    await this.inputPostTitle.fill(title);
    await this.inputPostContent.fill(content);
    await this.btnSavePost.click();
  }

  async createPostAndVerifyContent(title: string, content: string) {
    await this.createNewPost(title, content);
    await expect(this.formPostEntry).not.toBeVisible();
    await this.showPostByTitle(title);
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
    await expect(this.page.getByText(content)).toBeVisible();
  }

  async clickDeleteAndDecline(title: string) {
    await this.showPostByTitle(title);
    const item = this.postItem(title);
    await expect(item).toBeVisible();
    await item.locator("button#delete").click();
    const confirmDialog = item.locator("span.confirm-dialog");
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.locator("button[type='button']").click();
    await expect(confirmDialog).not.toBeVisible();
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async clickDeleteAndConfirm(title: string) {
    await this.showPostByTitle(title);
    const item = this.postItem(title);
    await expect(item).toBeVisible();
    await item.locator("button#delete").click();
    const confirmDialog = item.locator("span.confirm-dialog");
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.locator("button[type='submit']").click();
    await expect(
      this.page.getByRole("heading", { name: title }),
    ).not.toBeVisible();
  }
}
