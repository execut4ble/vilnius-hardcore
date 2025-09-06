import { test as base } from "@playwright/test";
import { LoginPage } from "./models/login.page";
import { CrewPage } from "./models/crew.page";
import { Layout } from "./models/layout";
import { EventsListPage } from "./models/events-list.page";
import { EventPage } from "./models/event.page";
import { BlogPage } from "./models/blog.page";
import { PostPage } from "./models/post.page";

type Fixtures = {
  loginPage: LoginPage;
  crewPage: CrewPage;
  layout: Layout;
  eventPage: EventPage;
  eventsPage: EventsListPage;
  blogPage: BlogPage;
  postPage: PostPage;
};

export const test = base.extend<Fixtures>({
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
});

export { expect } from "@playwright/test";
