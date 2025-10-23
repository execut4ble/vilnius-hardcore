import { test, expect } from "../fixtures";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

test.describe("Event CRUD flow", () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await page.goto("/crew");
    await loginPage.login(username, password);
    await expect(page).toHaveURL("crew");
    await page.goto("/events");
  });

  test("Create a new event", async ({ eventsPage }) => {
    const title: string = crypto.randomUUID();
    const externalUrl: string = "https://example.com/events/" + title;
    await eventsPage.createEventAndVerifyContent(
      title,
      new Date(),
      crypto.randomUUID(),
      true,
      externalUrl,
    );
  });

  test("Edit an event", async ({ page, eventsPage }) => {
    if ((await eventsPage.linkEvent.count()) === 0) {
      test.skip();
    } else {
      const editDescriptionValue: string = crypto.randomUUID();
      const editExternalUrlValue: string =
        "https://example.org/events/" + crypto.randomUUID();
      await eventsPage.btnEditEvent.first().click();
      await expect(eventsPage.formEventEntry).toBeVisible();
      await eventsPage.inputEventDescription.fill(editDescriptionValue);
      await eventsPage.inputEventExternalUrl.fill(editExternalUrlValue);
      await eventsPage.btnSaveEvent.click();
      await expect(page.getByText(editDescriptionValue)).toBeVisible();
      const linkExternalUrl = page.locator(
        `span.external-url a[href="${editExternalUrlValue}"]`,
      );
      await expect(linkExternalUrl).toBeVisible();
      await expect(linkExternalUrl).toContainText(
        new URL(editExternalUrlValue).hostname,
      );
    }
  });

  test("Delete an event", async ({ eventsPage }) => {
    if ((await eventsPage.linkEvent.count()) === 0) {
      test.skip();
    } else {
      await eventsPage.clickDeleteAndDecline();
      await eventsPage.clickDeleteAndConfirm();
    }
  });
});
