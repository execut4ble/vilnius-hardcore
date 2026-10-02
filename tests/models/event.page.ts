import { expect, type Locator, type Page } from "@playwright/test";

export class EventPage {
  readonly page: Page;
  readonly formComment: Locator;
  readonly inputCommentAuthor: Locator;
  readonly inputCommentText: Locator;
  readonly inputCommentChallenge: Locator;
  readonly chkBoxCommentAsCrew: Locator;
  readonly btnSubmitComment: Locator;
  readonly ctrComment: Locator;
  readonly ctrCommentContent: Locator;
  readonly ctrCommentCrewBadge: Locator;
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
    this.ctrCommentCrewBadge = page.locator(
      "div#comments-list div.comment span[title='Crew']",
    );
    this.labelChallengeError = page.locator(
      "form#add-comment input#acab + div.field-error",
    );
  }

  // Use undefined when posting anonymously
  async fillCommentAndSubmit(
    author: string | undefined,
    content: string,
    challenge?: string,
  ) {
    await expect(this.formComment).toBeVisible();
    if (author !== undefined) {
      await this.inputCommentAuthor.fill(author);
    }
    await this.inputCommentText.fill(content);
    if (challenge !== undefined) {
      await this.inputCommentChallenge.fill(challenge);
    }
    await this.btnSubmitComment.click();
  }

  async postCommentAndVerifyContent(
    author: string | undefined,
    content: string,
    challenge?: string,
  ) {
    await this.fillCommentAndSubmit(author, content, challenge);
    const comment = this.ctrComment.filter({ hasText: content });
    await expect(
      comment,
      "The comment with content " + content + " should be visible",
    ).toHaveCount(1);
  }

  async verifyCrewCommentForm() {
    await expect(this.formComment).toBeVisible();
    await expect(this.inputCommentChallenge).not.toBeVisible();
    await expect(this.chkBoxCommentAsCrew).toBeVisible();
    await expect(this.chkBoxCommentAsCrew).toBeChecked();
    await expect(this.inputCommentAuthor).not.toBeEditable();
  }

  async deleteComment(content: string) {
    const comment = this.ctrComment.filter({ hasText: content });
    await expect(
      comment,
      `The comment ${content} should be on the page`,
    ).toBeVisible();
    const form = comment.first().locator("form[action='?/remove_comment']");
    await expect(
      form,
      "A delete form should render on the comment for logged in users",
    ).toBeVisible();
    await form.locator("button[type='button']").first().click();
    await expect(form.locator("button[type='submit']")).toBeVisible();
    await form.locator("button[type='submit']").click();
    await expect(comment, "The comment should be deleted").toHaveCount(0);
  }

  async postAnonymousComment(author: string, content: string) {
    await expect(this.formComment).toBeVisible();
    await expect(this.inputCommentChallenge).not.toBeVisible();
    await this.chkBoxCommentAsCrew.uncheck();
    await expect(this.inputCommentAuthor).toBeEditable();
    await this.fillCommentAndSubmit(author, content);
    const comment = this.ctrComment.filter({ hasText: content });
    await expect(
      comment,
      "The comment with content " + content + " should be visible",
    ).toHaveCount(1);
  }
}
