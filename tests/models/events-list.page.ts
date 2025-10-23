import { expect, type Locator, type Page } from "@playwright/test";

export class EventsListPage {
  readonly page: Page;
  readonly linkEvent: Locator;
  readonly btnAddNewEvent: Locator;
  readonly formEventEntry: Locator;
  readonly inputEventTitle: Locator;
  readonly inputEventDate: Locator;
  readonly inputEventDescription: Locator;
  readonly inputEventExternalUrl: Locator;
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
    this.linkEvent = page.locator("ul.item-list event h2.title a");
    this.btnAddNewEvent = page.locator("button.new-event");
    this.formEventEntry = page.locator("form#add-event");
    this.inputEventTitle = page.locator("form#add-event input#title");
    this.inputEventDate = page.locator("form#add-event input#date");
    this.inputEventDescription = page.locator(
      "form#add-event textarea#description",
    );
    this.inputEventExternalUrl = page.locator(
      "form#add-event input#external_url",
    );
    this.chkBoxEventVisible = page.locator("form#add-event input#is_visible");
    this.btnSaveEvent = page.locator("form#add-event button[type='submit']");
    this.btnEditEvent = page.locator("event button#edit");
    this.btnDeleteEvent = page.locator("event button#delete");
    this.labelConfirmDelete = page.locator(
      "button#delete + span.confirm-dialog",
    );
    this.btnConfirmDelete = page.locator(
      "span.confirm-dialog > button[type='submit']",
    );
    this.btnDeclineDelete = page.locator(
      "span.confirm-dialog > button[type='button']",
    );
    this.labelItemCount = page.locator("div#item-total");
  }

  async openFirstEvent() {
    await this.linkEvent.first().click();
    const eventUrl = await this.linkEvent.first().getAttribute("href");
    await expect(this.page).toHaveURL(eventUrl as string);
  }

  async getItemCount(): Promise<number> {
    return Number(
      ((await this.labelItemCount.textContent()) as string)
        .split("out of")
        .pop(),
    );
  }

  async createNewEvent(
    title: string,
    date: Date,
    description: string,
    isVisible: boolean,
    externalUrl?: string,
  ) {
    await this.btnAddNewEvent.click();
    await expect(this.formEventEntry).toBeVisible();
    await this.inputEventTitle.fill(title);
    await this.inputEventDate.fill(
      date.toLocaleString("lt-LT", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    await this.inputEventDescription.fill(description);
    if (externalUrl) {
      await this.inputEventExternalUrl.fill(externalUrl);
    }
    await this.chkBoxEventVisible.setChecked(isVisible);
    await this.btnSaveEvent.click();
  }

  async createEventAndVerifyContent(
    title: string,
    date: Date,
    description: string,
    isVisible: boolean,
    externalUrl?: string,
  ) {
    const eventCount = await this.getItemCount();
    await this.createNewEvent(title, date, description, isVisible, externalUrl);
    await expect(this.formEventEntry).not.toBeVisible();
    expect(await this.getItemCount()).toEqual(eventCount + 1);
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
    await expect(this.page.getByText(description)).toBeVisible();
    if (externalUrl) {
      const linkExternalUrl = this.page.locator(
        `span.external-url a[href="${externalUrl}"]`,
      );
      const imgExternalUrl = this.page.locator(
        `span.external-url:has(a[href="${externalUrl}"]) span.icon svg`,
      );
      await expect(imgExternalUrl).toBeVisible();
      await expect(linkExternalUrl).toBeVisible();
      await expect(linkExternalUrl).toContainText(
        new URL(externalUrl).hostname,
      );
    }
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
    await expect(
      this.page.getByRole("heading", { name: eventTitle as string }),
    ).toBeVisible();
  }

  async clickDeleteAndConfirm() {
    await expect(this.linkEvent.first()).toBeVisible();
    const eventTitle: string | null = await this.linkEvent
      .first()
      .textContent();
    await this.btnDeleteEvent.first().click();
    await expect(this.labelConfirmDelete).toBeVisible();
    await this.btnConfirmDelete.click();
    await expect(
      this.page.getByRole("heading", { name: eventTitle as string }),
    ).not.toBeVisible();
  }
}
