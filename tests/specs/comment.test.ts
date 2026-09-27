import { test, expect } from "../fixtures";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

test.describe("Comments on events", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/events");
  });

  test("Post a comment on an event", async ({
    eventsPage,
    eventPage,
    layout,
  }) => {
    if ((await eventsPage.linkEvent.count()) === 0) {
      test.skip();
    } else {
      const author =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      await eventsPage.openFirstEvent();
      await eventPage.postCommentAndVerifyContent(
        author,
        crypto.randomUUID(),
        "1312",
      );
      await expect(layout.labelRecentComments.first()).toContainText(author);
    }
  });

  test("Fail comment challenge on an event", async ({
    eventsPage,
    eventPage,
  }) => {
    if ((await eventsPage.linkEvent.count()) === 0) {
      test.skip();
    } else {
      await eventsPage.openFirstEvent();
      await eventPage.fillCommentAndSubmit("test", crypto.randomUUID(), "1234");
      await expect(eventPage.labelChallengeError).toBeVisible();
    }
  });
});

test.describe("Comments on blog posts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("Post a comment on a blog post", async ({
    blogPage,
    postPage,
    layout,
  }) => {
    if ((await blogPage.linkPost.count()) === 0) {
      test.skip();
    } else {
      const author =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      await blogPage.openFirstPost();
      await postPage.postCommentAndVerifyContent(author, crypto.randomUUID());
      await expect(layout.labelRecentComments.first()).toContainText(author);
    }
  });

  test("Fail comment challenge on a blog post", async ({
    blogPage,
    postPage,
  }) => {
    if ((await blogPage.linkPost.count()) === 0) {
      test.skip();
    } else {
      await blogPage.openFirstPost();
      await postPage.fillCommentAndSubmit("test", crypto.randomUUID(), "1234");
      await expect(postPage.labelChallengeError).toBeVisible();
    }
  });
});

test.describe("Crew comments on events", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto("/crew");
    await loginPage.login(username, password);
    await expect(page).toHaveURL("crew");
    await page.goto("/events");
  });

  test("Crew member gets a crew badge on their comment", async ({
    eventsPage,
    eventPage,
  }) => {
    if ((await eventsPage.linkEvent.count()) === 0) {
      test.skip();
    } else {
      await eventsPage.openFirstEvent();
      await eventPage.verifyCrewCommentForm();
      const content = crypto.randomUUID();
      await eventPage.postCommentAndVerifyContent(undefined, content);
      await expect(eventPage.ctrComment.last()).toContainText(username!);
      await expect(eventPage.ctrCommentCrewBadge.last()).toBeVisible();
    }
  });

  test("Crew member can comment anonymously", async ({
    eventsPage,
    eventPage,
  }) => {
    if ((await eventsPage.linkEvent.count()) === 0) {
      test.skip();
    } else {
      await eventsPage.openFirstEvent();
      const author =
        Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      await eventPage.postAnonymousComment(author, crypto.randomUUID());
      await expect(eventPage.ctrComment.last()).toContainText(author);
      await expect(
        eventPage.ctrComment.last().locator("span[title='Crew']"),
      ).toHaveCount(0);
    }
  });
});
