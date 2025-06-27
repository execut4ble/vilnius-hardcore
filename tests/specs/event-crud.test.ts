import { test, expect } from "../fixtures";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

test.describe("Event CRUD flow", () => {
  test("Create a new event", async ({ page, loginPage, eventsPage }) => {
    await page.goto("/crew");
    await loginPage.login(username, password);
    await expect(page).toHaveURL("crew");
    await page.goto("/events");
    await eventsPage.createEventAndVerifyContent(
      crypto.randomUUID(),
      new Date(),
      crypto.randomUUID(),
      true,
    );
  });
});
