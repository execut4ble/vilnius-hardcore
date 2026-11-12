import { test, expect } from "../fixtures";
import "dotenv/config";
import type { Layout } from "../models/layout";
import type { Page } from "@playwright/test";

const username = process.env.TEST_USER;

const randomAuthor = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

async function findRecentComment(
  page: Page,
  layout: Layout,
  author: string,
  contentTitle: string,
) {
  const comment = layout.labelRecentComments
    .filter({ hasText: author })
    .filter({ hasText: contentTitle });
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.goto("/");
    if ((await comment.count()) > 0) {
      break;
    }
  }
  await expect(
    comment,
    `A comment by ${author} on ${contentTitle} should be in the sidebar`,
  ).toBeVisible();
  return comment.first();
}

async function verifyRecentCommentLink(
  page: Page,
  layout: Layout,
  author: string,
  contentTitle: string,
  headingTag: string,
) {
  const recentComment = await findRecentComment(
    page,
    layout,
    author,
    contentTitle,
  );
  const link = recentComment.locator("a");
  await expect(link).toHaveText(contentTitle);
  await link.click();
  await expect(
    page.locator(`section ${headingTag}`).first(),
    `The destination page should render the title ${contentTitle}`,
  ).toContainText(contentTitle);
  await expect(
    page.locator("div#comments-list div.comment").filter({ hasText: author }),
    `A comment by ${author} should be on the page`,
  ).toBeVisible();
}

test.describe("Comments on events", () => {
  test("Post a comment on an event", async ({
    page,
    eventsPage,
    eventPage,
    layout,
    testEvent,
  }) => {
    const author = randomAuthor();
    await page.goto("/events");
    await eventsPage.openEventByTitle(testEvent.title);
    await eventPage.postCommentAndVerifyContent(
      author,
      crypto.randomUUID(),
      "1312",
    );
    await expect(
      layout.labelRecentComments.filter({ hasText: author }),
    ).toBeVisible();
  });

  test("Fail comment challenge on an event", async ({
    page,
    eventsPage,
    eventPage,
    testEvent,
  }) => {
    await page.goto("/events");
    await eventsPage.openEventByTitle(testEvent.title);
    await eventPage.fillCommentAndSubmit("test", crypto.randomUUID(), "1234");
    await expect(eventPage.labelChallengeError).toBeVisible();
  });
});

test.describe("Comments on blog posts", () => {
  test("Post a comment on a blog post", async ({
    page,
    blogPage,
    postPage,
    layout,
    testPost,
  }) => {
    const author = randomAuthor();
    await page.goto("/blog");
    await blogPage.openPostByTitle(testPost.title);
    await postPage.postCommentAndVerifyContent(author, crypto.randomUUID());
    await expect(
      layout.labelRecentComments.filter({ hasText: author }),
    ).toBeVisible();
  });

  test("Fail comment challenge on a blog post", async ({
    page,
    blogPage,
    postPage,
    testPost,
  }) => {
    await page.goto("/blog");
    await blogPage.openPostByTitle(testPost.title);
    await postPage.fillCommentAndSubmit("test", crypto.randomUUID(), "1234");
    await expect(postPage.labelChallengeError).toBeVisible();
  });
});

test.describe("Crew comments on events", () => {
  test.use({ asCrew: true });

  test("Crew member gets a crew badge on their comment", async ({
    page,
    eventsPage,
    eventPage,
    testEvent,
  }) => {
    await page.goto("/events");
    await eventsPage.openEventByTitle(testEvent.title);
    await eventPage.verifyCrewCommentForm();
    const content = crypto.randomUUID();
    await eventPage.postCommentAndVerifyContent(undefined, content);
    const comment = eventPage.ctrComment.filter({ hasText: content });
    await expect(comment).toContainText(username!);
    await expect(comment.locator("span[title='Crew']")).toBeVisible();
  });

  test("Crew member can comment anonymously", async ({
    page,
    eventsPage,
    eventPage,
    testEvent,
  }) => {
    await page.goto("/events");
    await eventsPage.openEventByTitle(testEvent.title);
    const author = randomAuthor();
    const content = crypto.randomUUID();
    await eventPage.postAnonymousComment(author, content);
    const comment = eventPage.ctrComment.filter({ hasText: content });
    await expect(comment).toContainText(author);
    await expect(comment.locator("span[title='Crew']")).toHaveCount(0);
  });
});

test.describe("Recent comments sidebar links", () => {
  test("navigate from the sidebar to the right pages", async ({
    page,
    eventsPage,
    blogPage,
    eventPage,
    postPage,
    layout,
    testEvent,
    testPost,
  }) => {
    const eventAuthor = randomAuthor();
    const postAuthor = randomAuthor();

    await page.goto("/events");
    await eventsPage.openEventByTitle(testEvent.title);
    await eventPage.postCommentAndVerifyContent(
      eventAuthor,
      crypto.randomUUID(),
      "1312",
    );

    await page.goto("/blog");
    await blogPage.openPostByTitle(testPost.title);
    await postPage.postCommentAndVerifyContent(postAuthor, crypto.randomUUID());

    await verifyRecentCommentLink(
      page,
      layout,
      eventAuthor,
      testEvent.title,
      "h2.title",
    );
    await verifyRecentCommentLink(
      page,
      layout,
      postAuthor,
      testPost.title,
      "h1",
    );
  });
});
