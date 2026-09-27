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

  // Author and challenge are skipped when undefined: crew members have
  // a readonly author (the username) and no ACAB field in the form
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
    const originalCommentCount: number = await this.ctrComment.count();
    await this.fillCommentAndSubmit(author, content, challenge);
    await expect(this.ctrComment).toHaveCount(originalCommentCount + 1);
    await expect(this.ctrCommentContent.last()).toHaveText(content);
  }

  async verifyCrewCommentForm() {
    await expect(this.formComment).toBeVisible();
    await expect(this.inputCommentChallenge).not.toBeVisible();
    await expect(this.chkBoxCommentAsCrew).toBeVisible();
    await expect(this.chkBoxCommentAsCrew).toBeChecked();
    await expect(this.inputCommentAuthor).not.toBeEditable();
  }

  async postAnonymousComment(author: string, content: string) {
    await expect(this.formComment).toBeVisible();
    await expect(this.inputCommentChallenge).not.toBeVisible();
    await this.chkBoxCommentAsCrew.uncheck();
    await expect(this.inputCommentAuthor).toBeEditable();
    const originalCommentCount: number = await this.ctrComment.count();
    await this.fillCommentAndSubmit(author, content);
    await expect(this.ctrComment).toHaveCount(originalCommentCount + 1);
    await expect(this.ctrCommentContent.last()).toHaveText(content);
  }
}
