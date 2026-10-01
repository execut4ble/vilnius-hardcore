import { test } from "../fixtures";

test.describe("Comment moderation", () => {
  test.use({ asCrew: true });

  test("Crew member can delete a comment", async ({
    page,
    eventsPage,
    eventPage,
    testEvent,
  }) => {
    await page.goto("/events");
    await eventsPage.openEventByTitle(testEvent.title);
    const content = crypto.randomUUID();
    await eventPage.postCommentAndVerifyContent(undefined, content);
    await eventPage.deleteComment(content);
  });
});
