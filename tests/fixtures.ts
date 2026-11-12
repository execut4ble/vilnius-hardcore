import {
  test as base,
  expect,
  type Browser,
  type BrowserContext,
} from "@playwright/test";
import "dotenv/config";
import { LoginPage } from "./models/login.page";
import { CrewPage } from "./models/crew.page";
import { Layout } from "./models/layout";
import { EventsListPage } from "./models/events-list.page";
import { EventPage } from "./models/event.page";
import { BlogPage } from "./models/blog.page";
import { PostPage } from "./models/post.page";

const username = process.env.TEST_USER;
const password = process.env.TEST_USER_PASS;

type StorageState = Awaited<ReturnType<BrowserContext["storageState"]>>;

export type TestEvent = { title: string; description: string };
export type TestPost = { title: string; content: string };

type Fixtures = {
  loginPage: LoginPage;
  crewPage: CrewPage;
  layout: Layout;
  eventPage: EventPage;
  eventsPage: EventsListPage;
  blogPage: BlogPage;
  postPage: PostPage;
  testEvent: TestEvent;
  testPost: TestPost;
  crewStorageState: StorageState;
};

type Options = {
  asCrew: boolean;
};

// Workers are separate processes and this module is loaded once per worker,
// so this cache holds one login per worker.
const crewLogins = new Map<string, Promise<StorageState>>();

function getCrewStorageState(
  browser: Browser,
  baseURL: string | undefined,
): Promise<StorageState> {
  const key = baseURL ?? "";
  let login = crewLogins.get(key);
  if (!login) {
    login = (async () => {
      const context = await browser.newContext({ baseURL });
      try {
        const page = await context.newPage();
        await page.goto("/crew");
        await new LoginPage(page).login(username, password);
        await expect(page).toHaveURL("crew");
        return await context.storageState();
      } finally {
        await context.close();
      }
    })();
    // Don't cache a failed login, so a later test can try again
    login.catch(() => crewLogins.delete(key));
    crewLogins.set(key, login);
  }
  return login;
}

export const test = base.extend<Fixtures & Options>({
  crewStorageState: async ({ browser, baseURL }, use) => {
    await use(await getCrewStorageState(browser, baseURL));
  },
  asCrew: [false, { option: true }],
  storageState: async ({ storageState, asCrew, browser, baseURL }, use) => {
    await use(
      asCrew ? await getCrewStorageState(browser, baseURL) : storageState,
    );
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  crewPage: async ({ page }, use) => {
    await use(new CrewPage(page));
  },
  layout: async ({ page }, use) => {
    await use(new Layout(page));
  },
  eventPage: async ({ page }, use) => {
    await use(new EventPage(page));
  },
  eventsPage: async ({ page }, use) => {
    await use(new EventsListPage(page));
  },
  blogPage: async ({ page }, use) => {
    await use(new BlogPage(page));
  },
  postPage: async ({ page }, use) => {
    await use(new PostPage(page));
  },
  testEvent: async ({ browser, baseURL, crewStorageState }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: crewStorageState,
    });
    const page = await context.newPage();
    const eventsPage = new EventsListPage(page);
    const event: TestEvent = {
      title: `e2e-event-${crypto.randomUUID()}`,
      description: crypto.randomUUID(),
    };
    await page.goto("/events");
    await eventsPage.createEventAndVerifyContent(
      event.title,
      new Date(),
      event.description,
      true,
    );

    await use(event);

    // Runs after the test, pass or fail. No-op if the test deleted it itself.
    await page.goto("/events");
    await eventsPage.deleteEventByTitle(event.title);
    await context.close();
  },
  testPost: async ({ browser, baseURL, crewStorageState }, use) => {
    const context = await browser.newContext({
      baseURL,
      storageState: crewStorageState,
    });
    const page = await context.newPage();
    const blogPage = new BlogPage(page);
    const post: TestPost = {
      title: `e2e-post-${crypto.randomUUID()}`,
      content: crypto.randomUUID(),
    };
    await page.goto("/blog");
    await blogPage.createPostAndVerifyContent(post.title, post.content);

    await use(post);

    await page.goto("/blog");
    await blogPage.deletePostByTitle(post.title);
    await context.close();
  },
});

export { expect } from "@playwright/test";
