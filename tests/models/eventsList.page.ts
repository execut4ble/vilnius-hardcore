import { expect, type Locator, type Page } from "@playwright/test";

export class EventsListPage {
  readonly page: Page;
  readonly linkEvent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkEvent = page.locator("ul.eventList event h2.title a");
  }

  async openFirstEvent() {
    await this.linkEvent.first().click();
    const eventUrl = await this.linkEvent.first().getAttribute("href");
    await expect(this.page).toHaveURL(eventUrl as string);
  }
}
