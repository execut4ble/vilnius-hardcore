import { expect, test } from "@playwright/test";
import { EventPage } from "../models/event.page";
import { EventsListPage } from "../models/eventsList.page";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
});

test("Post a comment", async ({ page }) => {
  const eventsPage = new EventsListPage(page);
  const eventPage = new EventPage(page);
  await eventsPage.linkEvent.first().click();
  await eventPage.postCommentAndVerifyContent("test", crypto.randomUUID());
});

test("Fail post comment challenge", async ({ page }) => {
  const eventsPage = new EventsListPage(page);
  const eventPage = new EventPage(page);
  await eventsPage.linkEvent.first().click();
  await eventPage.fillCommentAndSubmit("test", crypto.randomUUID(), "1234");
  await expect(eventPage.labelChallengeError).toBeVisible();
});
