import { test as base } from "@playwright/test";
import { LoginPage } from "./models/login.page";
import { CrewPage } from "./models/crew.page";
import { Layout } from "./models/layout";
import { EventsListPage } from "./models/eventsList.page";
import { EventPage } from "./models/event.page";

type Fixtures = {
  loginPage: LoginPage;
  crewPage: CrewPage;
  layout: Layout;
  eventPage: EventPage;
  eventsPage: EventsListPage;
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
});

export { expect } from "@playwright/test";
