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
  readonly btnDeletePost: Locator;
  readonly labelConfirmDelete: Locator;
  readonly btnConfirmDelete: Locator;
  readonly btnDeclineDelete: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkPost = page.locator("ul.postList post h2.title a");
    this.btnAddNewPost = page.locator("button.new-post");
    this.formPostEntry = page.locator("form.newPost");
    this.inputPostTitle = page.locator("form.newPost input#title");
    this.inputPostContent = page.locator(
      "form.newPost textarea#description",
    );
    this.btnSavePost = page.locator("form.newPost button[type='submit']");
    this.btnEditPost = page.locator("post button#edit");
    this.btnDeletePost = page.locator("post button#delete");
    this.labelConfirmDelete = page.locator("button#delete + div.confirm");
    this.btnConfirmDelete = page.locator("div.confirm > button[type='submit']");
    this.btnDeclineDelete = page.locator("div.confirm > button[type='button']");
    this.labelItemCount = page.locator("div.itemCount");
  }

  async getItemCount(): Promise<number> {
    return Number((await this.labelItemCount.textContent() as string).split("out of").pop())
  }

  async openFirstPost() {
    await this.linkPost.first().click();
    const postUrl = await this.linkPost.first().getAttribute("href");
    await expect(this.page).toHaveURL(postUrl as string);
  }

  async createNewPost(
    title: string,
    content: string,
  ) {
    await this.btnAddNewPost.click();
    await expect(this.formPostEntry).toBeVisible();
    await this.inputPostTitle.fill(title);
    await this.inputPostContent.fill(content);
    await this.btnSavePost.click();
  }

  async createPostAndVerifyContent(
    title: string,
    content: string,
  ) {
    const postCount = await this.getItemCount();
    console.log(postCount);
    await this.createNewPost(title, content);
    await expect(this.formPostEntry).not.toBeVisible();
    expect(await this.getItemCount()).toEqual(postCount + 1);
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
    await expect(this.page.getByText(content)).toBeVisible();
  }

  async clickDeleteAndDecline() {
    await expect(this.linkPost.first()).toBeVisible();
    const postTitle: string | null = await this.linkPost
      .first()
      .textContent();
    await this.btnDeletePost.first().click();
    await expect(this.labelConfirmDelete).toBeVisible();
    await this.btnDeclineDelete.click();
    await expect(this.labelConfirmDelete).not.toBeVisible();
    await expect(this.page.getByText(postTitle as string)).toBeVisible();
  }

  async clickDeleteAndConfirm() {
    await expect(this.linkPost.first()).toBeVisible();
    const postTitle: string | null = await this.linkPost
      .first()
      .textContent();
    await this.btnDeletePost.first().click();
    await expect(this.labelConfirmDelete).toBeVisible();
    await this.btnConfirmDelete.click();
    await expect(this.page.getByText(postTitle as string)).not.toBeVisible();
  }
}
