import { expect, test } from "@playwright/test";
import { EventPage } from "../models/event.page";
import { EventsListPage } from "../models/eventsList.page";
import "dotenv/config";
import { Layout } from "../models/layout";

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
});

test("Post a comment on an event", async ({ page }) => {
  const layout = new Layout(page);
  const author =
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const eventsPage = new EventsListPage(page);
  const eventPage = new EventPage(page);
  await eventsPage.openFirstEvent();
  await eventPage.postCommentAndVerifyContent(author, crypto.randomUUID());
  await expect(layout.labelRecentComments.first()).toContainText(author);
});

test("Fail comment challenge on an event", async ({ page }) => {
  const eventsPage = new EventsListPage(page);
  const eventPage = new EventPage(page);
  await eventsPage.openFirstEvent();
  await eventPage.fillCommentAndSubmit("test", crypto.randomUUID(), "1234");
  await expect(eventPage.labelChallengeError).toBeVisible();
});
