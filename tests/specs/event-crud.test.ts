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
    await eventsPage.createEventAndVerifyContent(
      crypto.randomUUID(),
      new Date(),
      crypto.randomUUID(),
      true,
    );
  });

  test("Edit an event", async ({ page, eventsPage }) => {
    const editDescriptionValue: string = crypto.randomUUID();
    await eventsPage.btnEditEvent.first().click();
    await expect(eventsPage.formEventEntry).toBeVisible();
    await eventsPage.inputEventDescription.fill(editDescriptionValue);
    await eventsPage.btnSaveEvent.click();
    await expect(page.getByText(editDescriptionValue)).toBeVisible();
  });

  test("Delete an event", async ({ eventsPage }) => {
    eventsPage.clickDeleteAndDecline();
    eventsPage.clickDeleteAndConfirm();
  });
});
