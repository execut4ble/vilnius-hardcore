import { test, expect } from "../fixtures";

test.describe("Site search", () => {
  test("sidebar search form action submits to /search?query=", async ({
    page,
    layout,
    testEvent,
  }) => {
    await page.goto("/");
    await layout.searchForm.fill(testEvent.title);
    await layout.searchForm.press("Enter");
    await expect(page).toHaveURL(/\/search\?query=/);
    await expect(
      page.getByRole("heading", { name: testEvent.title, exact: false }),
    ).toBeVisible();
  });

  test("empty search form submission lands on /search with a prompt", async ({
    page,
    layout,
  }) => {
    await page.goto("/events");
    await layout.searchForm.fill("");
    await layout.searchForm.press("Enter");
    await expect(page).toHaveURL(/\/search$/);
    await expect(page.getByText("Type something to search.")).toBeVisible();
  });

  test("finds an event by title and a post by title", async ({
    page,
    testEvent,
    testPost,
  }) => {
    await page.goto(`/search?query=${encodeURIComponent(testEvent.title)}`);
    await expect(
      page.getByRole("heading", { name: testEvent.title, exact: false }),
    ).toBeVisible();

    await page.goto(`/search?query=${encodeURIComponent(testPost.title)}`);
    await expect(
      page.getByRole("heading", { name: testPost.title }),
    ).toBeVisible();
  });

  test("finds an event by a word from its description", async ({
    page,
    testEvent,
  }) => {
    await page.goto(
      `/search?query=${encodeURIComponent(testEvent.description)}`,
    );
    await expect(
      page.getByRole("heading", { name: testEvent.title, exact: false }),
    ).toBeVisible();
  });

  test("queries shorter than 2 characters are not accepted", async ({
    page,
    layout,
  }) => {
    // Native minlength validation blocks the submission
    await page.goto("/events");
    await layout.searchForm.fill("a");
    await layout.searchForm.press("Enter");
    await expect(page).toHaveURL(/\/events$/);

    // The server treats a short query as no query
    await page.goto("/search?query=a");
    await expect(page.getByText("Type something to search.")).toBeVisible();
  });

  test("shows a prompt without a query and a message without results", async ({
    page,
  }) => {
    await page.goto("/search");
    await expect(page.getByText("Type something to search.")).toBeVisible();

    await page.goto("/search?query=this-query-matches-nothing-xyz");
    await expect(
      page.getByText('No results found for "this-query-matches-nothing-xyz".'),
    ).toBeVisible();
  });
});
