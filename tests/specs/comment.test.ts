import { expect, test } from "@playwright/test";
import { LoginPage } from "../models/login.page";
import { CrewPage } from "../models/crew.page";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

const newComment = crypto.randomUUID();

test.beforeEach(async ({ page }) => {
  await page.goto("/events");
});

test("Post a comment", async ({ page }) => {
  await page.locator("ul.eventList event h2.title a").first().click();
  await expect(
    page.locator("form.comment"),
    "Comment form should be visible",
  ).toBeVisible();
  const originalCommentCount: number = await page
    .locator("div.comments > div.comment")
    .count();
  await page.locator("form.comment > input#author").fill("test");
  await page.locator("form.comment > textarea#content").fill(newComment);
  await page.locator("form.comment > input#acab").fill("1312");
  await page.locator("form.comment > button[type='submit']").click();
  await expect(page.locator("div.comments > div.comment")).toHaveCount(
    originalCommentCount + 1,
  );
  await expect(
    page.locator("div.comments > div.comment > .content").last(),
  ).toHaveText(newComment);
});

test("Fail post comment challenge", async ({ page }) => {
  await page.locator("ul.eventList event h2.title a").first().click();
  await expect(
    page.locator("form.comment"),
    "Comment form should be visible",
  ).toBeVisible();
  await page.locator("form.comment > input#author").fill("test");
  await page.locator("form.comment > textarea#content").fill("test");
  await page.locator("form.comment > input#acab").fill("1234");
  await page.locator("form.comment > button[type='submit']").click();
  await expect(
    page.locator("form.comment > input#acab + div.fieldError"),
  ).toBeVisible();
});
