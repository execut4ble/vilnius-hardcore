import { expect, type Locator, type Page } from "@playwright/test";

export class EventsListPage {
  readonly page: Page;
  readonly linkEvent: Locator;
  readonly btnAddNewEvent: Locator;
  readonly formEventEntry: Locator;
  readonly inputEventTitle: Locator;
  readonly inputEventDate: Locator;
  readonly inputEventDescription: Locator;
  readonly chkBoxEventVisible: Locator;
  readonly btnCreateEvent: Locator;
  readonly labelEventDate: Locator;
  readonly labelEventDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkEvent = page.locator("ul.eventList event h2.title a");
    this.btnAddNewEvent = page.locator("button.new-event");
    this.formEventEntry = page.locator("div.event-entry-form");
    this.inputEventTitle = page.locator("form.newEvent input#title");
    this.inputEventDate = page.locator("form.newEvent input#date");
    this.inputEventDescription = page.locator(
      "form.newEvent textarea#description",
    );
    this.chkBoxEventVisible = page.locator("form.newEvent input#is_visible");
    this.btnCreateEvent = page.locator("form.newEvent button[type='submit']");
    this.labelEventDate = page.locator("event div.meta > p.date");
    this.labelEventDescription = page.locator(
      "event div.eventBody div.description",
    );
  }

  async openFirstEvent() {
    await this.linkEvent.first().click();
    const eventUrl = await this.linkEvent.first().getAttribute("href");
    await expect(this.page).toHaveURL(eventUrl as string);
  }

  async createNewEvent(
    title: string,
    date: Date,
    description: string,
    isVisible: boolean,
  ) {
    await this.btnAddNewEvent.click();
    await expect(this.formEventEntry).toBeVisible();
    await this.inputEventTitle.fill(title);
    await this.inputEventDate.fill(date.toISOString().slice(0, 16));
    await this.inputEventDescription.fill(description);
    await this.chkBoxEventVisible.setChecked(isVisible);
    await this.btnCreateEvent.click();
  }

  async createEventAndVerifyContent(
    title: string,
    date: Date,
    description: string,
    isVisible: boolean,
  ) {
    const eventCount = await this.linkEvent.count();
    await this.createNewEvent(title, date, description, isVisible);
    await expect(this.formEventEntry).not.toBeVisible();
    await expect(this.linkEvent).toHaveCount(eventCount + 1);
    await expect(this.linkEvent.first()).toHaveText(title);
    await expect(this.labelEventDescription.first()).toHaveText(description);
  }
}
