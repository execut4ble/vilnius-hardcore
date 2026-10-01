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
  readonly btnShowMore: Locator;

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
    this.btnShowMore = page.locator("button#load-more");
  }

  eventItem(title: string): Locator {
    return this.page.locator("ul.item-list event").filter({ hasText: title });
  }

  private async revealEvent(
    title: string,
    giveUpOnceAllShown = false,
  ): Promise<boolean> {
    const item = this.eventItem(title);
    const allItems = this.page.locator("ul.item-list event");
    const deadline = Date.now() + (giveUpOnceAllShown ? 3_000 : 15_000);
    while (Date.now() < deadline) {
      if ((await item.count()) > 0) {
        return true;
      }
      if (await this.btnShowMore.isVisible()) {
        await this.btnShowMore.click({ timeout: 1_000 }).catch(() => {});
      } else if (giveUpOnceAllShown && (await allItems.count()) > 0) {
        return false;
      }
      await this.page.waitForTimeout(200);
    }
    return false;
  }

  async showEventByTitle(title: string) {
    expect(
      await this.revealEvent(title),
      `event "${title}" was not found in the list`,
    ).toBe(true);
  }

  async openEventByTitle(title: string) {
    await this.showEventByTitle(title);
    const link = this.linkEvent.filter({ hasText: title });
    const eventUrl = await link.first().getAttribute("href");
    await link.first().click();
    await expect(this.page).toHaveURL(eventUrl as string);
  }

  async openEditFormByTitle(title: string) {
    await this.showEventByTitle(title);
    await this.eventItem(title).locator("button#edit").click();
    await expect(this.formEventEntry).toBeVisible();
  }

  // No-op when the event is already gone (e.g. the test deleted it itself)
  async deleteEventByTitle(title: string) {
    if (!(await this.revealEvent(title, true))) {
      return;
    }
    await this.clickDeleteAndConfirm(title);
  }

  private async waitForAnimationsToFinish() {
    await this.page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
          .map((a) => a.finished.catch(() => {})),
      ),
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
    await this.waitForAnimationsToFinish();
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

    const created = this.page.waitForResponse(
      (r) =>
        r.request().method() === "POST" && r.url().includes("?/create_event"),
    );

    await this.btnSaveEvent.click();
    expect((await created).ok()).toBeTruthy();
  }

  async createEventAndVerifyContent(
    title: string,
    date: Date,
    description: string,
    isVisible: boolean,
    externalUrl?: string,
  ) {
    await this.createNewEvent(title, date, description, isVisible, externalUrl);
    await expect(this.formEventEntry).not.toBeVisible();
    await this.showEventByTitle(title);
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

  async clickDeleteAndDecline(title: string) {
    await this.showEventByTitle(title);
    const item = this.eventItem(title);
    await expect(item).toBeVisible();
    await item.locator("button#delete").click();
    const confirmDialog = item.locator("span.confirm-dialog");
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.locator("button[type='button']").click();
    await expect(confirmDialog).not.toBeVisible();
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async clickDeleteAndConfirm(title: string) {
    await this.showEventByTitle(title);
    const item = this.eventItem(title);
    await expect(item).toBeVisible();
    await item.locator("button#delete").click();
    const confirmDialog = item.locator("span.confirm-dialog");
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.locator("button[type='submit']").click();
    await expect(
      this.page.getByRole("heading", { name: title }),
    ).not.toBeVisible();
  }
}
