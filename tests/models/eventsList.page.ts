import { expect, type Locator, type Page } from "@playwright/test";

export class EventsListPage {
  readonly page: Page;
  readonly linkEvent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkEvent = page.locator("ul.eventList event h2.title a");
  }
}
