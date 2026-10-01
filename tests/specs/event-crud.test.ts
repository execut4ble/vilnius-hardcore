import { test, expect } from "../fixtures";

test.describe("Event CRUD flow", () => {
  test.use({ asCrew: true });

  let createdEventTitle: string | undefined;

  test.afterEach(async ({ page, eventsPage }) => {
    if (createdEventTitle) {
      await page.goto("/events");
      await eventsPage.deleteEventByTitle(createdEventTitle);
      createdEventTitle = undefined;
    }
  });

  test("Create a new event", async ({ page, eventsPage }) => {
    const title: string = `e2e-event-${crypto.randomUUID()}`;
    const externalUrl: string = "https://example.com/events/" + title;
    createdEventTitle = title;
    await page.goto("/events");
    await eventsPage.createEventAndVerifyContent(
      createdEventTitle,
      new Date(),
      crypto.randomUUID(),
      true,
      externalUrl,
    );
  });

  test("Edit an event", async ({ page, eventsPage, testEvent }) => {
    const editDescriptionValue: string = crypto.randomUUID();
    const editExternalUrlValue: string =
      "https://example.org/events/" + crypto.randomUUID();
    await page.goto("/events");
    await eventsPage.openEditFormByTitle(testEvent.title);
    await eventsPage.inputEventDescription.fill(editDescriptionValue);
    await eventsPage.inputEventExternalUrl.fill(editExternalUrlValue);
    await eventsPage.btnSaveEvent.click();
    await eventsPage.showEventByTitle(testEvent.title);
    await expect(page.getByText(editDescriptionValue)).toBeVisible();
    const linkExternalUrl = page.locator(
      `span.external-url a[href="${editExternalUrlValue}"]`,
    );
    await expect(linkExternalUrl).toBeVisible();
    await expect(linkExternalUrl).toContainText(
      new URL(editExternalUrlValue).hostname,
    );
  });

  test("Delete an event", async ({ page, eventsPage, testEvent }) => {
    await page.goto("/events");
    await eventsPage.clickDeleteAndDecline(testEvent.title);
    await eventsPage.clickDeleteAndConfirm(testEvent.title);
  });
});
