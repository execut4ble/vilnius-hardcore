import { test, expect } from "../fixtures";
import "dotenv/config";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

test.describe("Post CRUD flow", () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await page.goto("/crew");
    await loginPage.login(username, password);
    await expect(page).toHaveURL("crew");
    await page.goto("/blog");
  });

  test("Create a new post", async ({ blogPage }) => {
    await blogPage.createPostAndVerifyContent(
      crypto.randomUUID(),
      crypto.randomUUID(),
    );
  });

  test("Edit a post", async ({ page, blogPage }) => {
    if ((await blogPage.linkPost.count()) === 0) {
      test.skip();
    } else {
      const editDescriptionValue: string = crypto.randomUUID();
      await blogPage.btnEditPost.first().click();
      await expect(blogPage.formPostEntry).toBeVisible();
      await blogPage.inputPostContent.fill(editDescriptionValue);
      await blogPage.btnSavePost.click();
      await expect(page.getByText(editDescriptionValue)).toBeVisible();
    }
  });

  test("Delete an post", async ({ blogPage }) => {
    if ((await blogPage.linkPost.count()) === 0) {
      test.skip();
    } else {
      await blogPage.clickDeleteAndDecline();
      await blogPage.clickDeleteAndConfirm();
    }
  });
});
