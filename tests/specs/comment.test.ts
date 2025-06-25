import { test, expect } from "../fixtures";
import "dotenv/config";

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
});

test("Post a comment on an event", async ({
  eventsPage,
  eventPage,
  layout,
}) => {
  const author =
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  await eventsPage.openFirstEvent();
  await eventPage.postCommentAndVerifyContent(author, crypto.randomUUID());
  await expect(layout.labelRecentComments.first()).toContainText(author);
});

test("Fail comment challenge on an event", async ({
  eventsPage,
  eventPage,
}) => {
  await eventsPage.openFirstEvent();
  await eventPage.fillCommentAndSubmit("test", crypto.randomUUID(), "1234");
  await expect(eventPage.labelChallengeError).toBeVisible();
});
