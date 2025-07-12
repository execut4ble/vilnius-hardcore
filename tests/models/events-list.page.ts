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
  readonly btnSaveEvent: Locator;
  readonly btnEditEvent: Locator;
  readonly btnDeleteEvent: Locator;
  readonly labelConfirmDelete: Locator;
  readonly btnConfirmDelete: Locator;
  readonly btnDeclineDelete: Locator;
  readonly labelItemCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkEvent = page.locator("ul.eventList event h2.title a");
    this.btnAddNewEvent = page.locator("button.new-event");
    this.formEventEntry = page.locator("form.newEvent");
    this.inputEventTitle = page.locator("form.newEvent input#title");
    this.inputEventDate = page.locator("form.newEvent input#date");
    this.inputEventDescription = page.locator(
      "form.newEvent textarea#description",
    );
    this.chkBoxEventVisible = page.locator("form.newEvent input#is_visible");
    this.btnSaveEvent = page.locator("form.newEvent button[type='submit']");
    this.btnEditEvent = page.locator("event button#edit");
    this.btnDeleteEvent = page.locator("event button#delete");
    this.labelConfirmDelete = page.locator("button#delete + div.confirm");
    this.btnConfirmDelete = page.locator("div.confirm > button[type='submit']");
    this.btnDeclineDelete = page.locator("div.confirm > button[type='button']");
    this.labelItemCount = page.locator("div.itemCount");
  }

  async openFirstEvent() {
    await this.linkEvent.first().click();
    const eventUrl = await this.linkEvent.first().getAttribute("href");
    await expect(this.page).toHaveURL(eventUrl as string);
  }

  async getItemCount(): Promise<number> {
    return Number((await this.labelItemCount.textContent() as string).split("out of").pop())
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
    await this.btnSaveEvent.click();
  }

  async createEventAndVerifyContent(
    title: string,
    date: Date,
    description: string,
    isVisible: boolean,
  ) {
    const eventCount = await this.getItemCount();
    await this.createNewEvent(title, date, description, isVisible);
    await expect(this.formEventEntry).not.toBeVisible();
    expect(await this.getItemCount()).toEqual(eventCount + 1);
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
    await expect(this.page.getByText(description)).toBeVisible();
  }

  async clickDeleteAndDecline() {
    await expect(this.linkEvent.first()).toBeVisible();
    const eventTitle: string | null = await this.linkEvent
      .first()
      .textContent();
    await this.btnDeleteEvent.first().click();
    await expect(this.labelConfirmDelete).toBeVisible();
    await this.btnDeclineDelete.click();
    await expect(this.labelConfirmDelete).not.toBeVisible();
    await expect(this.page.getByText(eventTitle as string)).toBeVisible();
  }

  async clickDeleteAndConfirm() {
    await expect(this.linkEvent.first()).toBeVisible();
    const eventTitle: string | null = await this.linkEvent
      .first()
      .textContent();
    await this.btnDeleteEvent.first().click();
    await expect(this.labelConfirmDelete).toBeVisible();
    await this.btnConfirmDelete.click();
    await expect(this.page.getByText(eventTitle as string)).not.toBeVisible();
  }
}
