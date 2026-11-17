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

  test("empty search form submission is blocked by the required attribute", async ({
    page,
    layout,
  }) => {
    await page.goto("/events");
    await layout.searchForm.fill("");
    await layout.searchForm.press("Enter");
    await expect(page).toHaveURL(/\/events$/);
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

  test.describe("Accent-insensitive search", () => {
    test.use({ testEventDescription: "ąčęėįšųūž" });

    test("finds an event by accented Lithuanian letters", async ({
      page,
      testEvent,
    }) => {
      await page.goto(`/search?query=${encodeURIComponent("ąčęėįšųūž")}`);
      await expect(
        page.getByRole("heading", { name: testEvent.title, exact: false }),
      ).toBeVisible();

      await page.goto(`/search?query=${encodeURIComponent("aceeisuuz")}`);
      await expect(
        page.getByRole("heading", { name: testEvent.title, exact: false }),
      ).toBeVisible();
    });
  });

  test("special characters in the query are matched literally", async ({
    page,
  }) => {
    // "%%" would match every row if it ever reached an unescaped LIKE, and an
    // unescaped "([" would throw when compiled into the whole-word RegExp
    for (const q of ["%%", "(["]) {
      await page.goto(`/search?query=${encodeURIComponent(q)}`);
      await expect(
        page.getByText(`No results found for "${q}".`),
      ).toBeVisible();
    }
  });

  test.describe("Search over rendered text, not markdown/HTML source", () => {
    // Creating events and asserting ranking needs the crew UI
    test.use({ asCrew: true });

    test("a token that only appears in the source (hrefs, iframes) does not match", async ({
      page,
      eventsPage,
    }) => {
      const title = `e2e-srctext-${crypto.randomUUID()}`;
      await page.goto("/events");
      await eventsPage.createNewEvent(
        title,
        new Date(),
        "Full set on [YouTube](https://example.com/embed/iframe-token-xyz) and the [band site](https://band.example/href-token-abc).",
        true,
      );
      await expect(eventsPage.formEventEntry).not.toBeVisible();

      // Present only in the markdown source, never in the rendered text
      for (const token of ["iframe-token-xyz", "href-token-abc"]) {
        await page.goto(`/search?query=${encodeURIComponent(token)}`);
        await expect(
          page.getByRole("heading", { name: title, exact: false }),
        ).not.toBeVisible();
      }

      // The rendered link text does match
      await page.goto(`/search?query=${encodeURIComponent("YouTube")}`);
      await expect(
        page.getByRole("heading", { name: title, exact: false }),
      ).toBeVisible();

      await page.goto("/events");
      await eventsPage.deleteEventByTitle(title);
    });

    test("ranks a whole-word match above a substring match", async ({
      page,
      eventsPage,
    }) => {
      // Unique token: independent of other content and of the result limit
      const token = `rank${crypto.randomUUID().replaceAll("-", "")}`;
      const wordTitle = `e2e-word-${crypto.randomUUID()}`;
      const substringTitle = `e2e-sub-${crypto.randomUUID()}`;
      await page.goto("/events");
      // token as a standalone word vs. inside a longer word
      await eventsPage.createEventAndVerifyContent(
        wordTitle,
        new Date(),
        `the ${token} played hardcore`,
        true,
      );
      await eventsPage.createEventAndVerifyContent(
        substringTitle,
        new Date(),
        `high ${token}width connection`,
        true,
      );

      await page.goto(`/search?query=${token}`);
      const titles = await page
        .locator("ul.item-list h2.title a")
        .allTextContents();
      const wordIndex = titles.findIndex((t) => t.includes(wordTitle));
      const substringIndex = titles.findIndex((t) =>
        t.includes(substringTitle),
      );
      expect(wordIndex).toBeGreaterThanOrEqual(0);
      expect(substringIndex).toBeGreaterThanOrEqual(0);
      expect(wordIndex).toBeLessThan(substringIndex);

      await page.goto("/events");
      await eventsPage.deleteEventByTitle(wordTitle);
      await eventsPage.deleteEventByTitle(substringTitle);
    });
  });
});
