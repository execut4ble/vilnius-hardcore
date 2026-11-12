import { expect, type Locator, type Page } from "@playwright/test";

export class PostPage {
  readonly page: Page;
  readonly formComment: Locator;
  readonly inputCommentAuthor: Locator;
  readonly inputCommentText: Locator;
  readonly inputCommentChallenge: Locator;
  readonly chkBoxCommentAsCrew: Locator;
  readonly btnSubmitComment: Locator;
  readonly ctrComment: Locator;
  readonly ctrCommentContent: Locator;
  readonly labelChallengeError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formComment = page.locator("form#add-comment");
    this.inputCommentAuthor = page.locator("form#add-comment input#author");
    this.inputCommentText = page.locator("form#add-comment textarea#content");
    this.inputCommentChallenge = page.locator("form#add-comment input#acab");
    this.chkBoxCommentAsCrew = page.locator(
      "form#add-comment input#authorIsCrew",
    );
    this.btnSubmitComment = page.locator(
      "form#add-comment button[type='submit']",
    );
    this.ctrComment = page.locator("div#comments-list div.comment");
    this.ctrCommentContent = page.locator(
      "div#comments-list div.comment .comment-content",
    );
    this.labelChallengeError = page.locator(
      "form#add-comment input#acab + div.field-error",
    );
  }

  async fillCommentAndSubmit(
    author: string,
    content: string,
    challenge: string,
  ) {
    await expect(this.formComment).toBeVisible();
    await this.inputCommentAuthor.fill(author);
    await this.inputCommentText.fill(content);
    await this.inputCommentChallenge.fill(challenge);
    await this.btnSubmitComment.click();
  }

  async postCommentAndVerifyContent(author: string, content: string) {
    await this.fillCommentAndSubmit(author, content, "1312");
    const comment = this.ctrComment.filter({ hasText: content });
    await expect(comment, "The comment should be deleted").toHaveCount(1);
  }

  async postAnonymousComment(author: string, content: string) {
    await expect(this.formComment).toBeVisible();
    await expect(this.inputCommentChallenge).not.toBeVisible();
    await this.chkBoxCommentAsCrew.uncheck();
    await expect(this.inputCommentAuthor).toBeEditable();
    await this.inputCommentAuthor.fill(author);
    await this.inputCommentText.fill(content);
    await this.btnSubmitComment.click();
    const comment = this.ctrComment.filter({ hasText: content });
    await expect(
      comment,
      `The comment ${content} should be visible`,
    ).toHaveCount(1);
  }
}
