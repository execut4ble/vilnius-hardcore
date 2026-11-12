import { test, expect } from "../fixtures";

test.describe("Post CRUD flow", () => {
  test.use({ asCrew: true });

  let createdPostTitle: string | undefined;

  test.afterEach(async ({ page, blogPage }) => {
    if (createdPostTitle) {
      await page.goto("/blog");
      await blogPage.deletePostByTitle(createdPostTitle);
      createdPostTitle = undefined;
    }
  });

  test("Create a new post", async ({ page, blogPage }) => {
    const title: string = `e2e-post-${crypto.randomUUID()}`;
    createdPostTitle = title;
    await page.goto("/blog");
    await blogPage.createPostAndVerifyContent(title, crypto.randomUUID());
  });

  test("Edit a post", async ({ page, blogPage, testPost }) => {
    const editDescriptionValue: string = crypto.randomUUID();
    await page.goto("/blog");
    await blogPage.openEditFormByTitle(testPost.title);
    await blogPage.inputPostContent.fill(editDescriptionValue);
    await blogPage.btnSavePost.click();
    await blogPage.showPostByTitle(testPost.title);
    await expect(page.getByText(editDescriptionValue)).toBeVisible();
  });

  test("Delete a post", async ({ page, blogPage, testPost }) => {
    await page.goto("/blog");
    await blogPage.clickDeleteAndDecline(testPost.title);
    await blogPage.clickDeleteAndConfirm(testPost.title);
  });
});
