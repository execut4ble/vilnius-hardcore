import { test, expect } from "../fixtures";
import type { Layout } from "../models/layout";

const publicPages: Array<{ path: string; heading: "h1" | "h2" }> = [
  { path: "/", heading: "h2" },
  { path: "/about", heading: "h1" },
  { path: "/events", heading: "h1" },
  { path: "/events/archive", heading: "h1" },
  { path: "/xi20-guidelines", heading: "h1" },
  { path: "/blog", heading: "h1" },
  { path: "/contacts", heading: "h1" },
  { path: "/crew/login", heading: "h1" },
];

const crewPages = ["/crew", "/crew/users", "/crew/jail"];

async function verifyPageLoaded(
  layout: Layout,
  path: string,
  { heading = "h1" }: { heading?: "h1" | "h2" } = {},
) {
  await layout.page.goto(path);
  await expect(
    layout.page.locator("section"),
    `Layout should render on ${path}`,
  ).toBeVisible();
  await expect(
    layout.errorPage,
    `Error layout should not render on ${path}`,
  ).not.toBeVisible();
  await expect(
    layout.page.locator(`section ${heading}`).first(),
    `A ${heading} heading should render on ${path}`,
  ).toBeVisible();
}

test.describe("Site navigation", () => {
  test("All public pages load", async ({ layout }) => {
    for (const { path, heading } of publicPages) {
      await verifyPageLoaded(layout, path, { heading });
    }
  });

  test("Non-existent routes render the 404 layout", async ({
    page,
    layout,
  }) => {
    await page.goto("/definitely-not-a-page");
    await expect(
      layout.errorPage,
      "Error layout should render for a 404",
    ).toBeVisible();
  });

  test("Crew pages redirect to login when not authenticated", async ({
    page,
    layout,
  }) => {
    for (const path of crewPages) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/crew\/login/);
      await expect(
        layout.errorPage,
        `Error layout should not render on ${path}`,
      ).not.toBeVisible();
      await expect(
        page.locator("section h1").first(),
        "The login page should render",
      ).toBeVisible();
    }
  });

  test("Menu links navigate to the right pages", async ({ page, layout }) => {
    await page.goto("/");
    const menuLinks = layout.menuNav.locator("a");
    const internalLinks: string[] = [];
    for (let i = 0; i < (await menuLinks.count()); i++) {
      const href = await menuLinks.nth(i).getAttribute("href");
      if (href?.startsWith("/")) {
        internalLinks.push(href);
      }
    }
    expect(
      internalLinks.length,
      "Menu should have internal links",
    ).toBeGreaterThan(0);

    for (const href of internalLinks) {
      await page.goto("/");
      await layout.menuNav.locator(`a[href="${href}"]`).click();
      await expect(page).toHaveURL(new URL(href, page.url()).href);
      await expect(
        layout.menuNav
          .locator(`li[aria-current="page"] a[href="${href}"]`)
          .first(),
      ).toBeVisible();
      await expect(
        layout.errorPage,
        `Error layout should not render on ${href}`,
      ).not.toBeVisible();
    }
  });

  test("Language switcher above the menu switches the language", async ({
    page,
    layout,
  }) => {
    await page.goto("/");
    await expect(layout.tagHtml).toHaveAttribute("lang", "en");
    await layout.switchLocale("lt");
    await expect(layout.tagHtml).toHaveAttribute("lang", "lt");
    await layout.switchLocale("en");
    await expect(layout.tagHtml).toHaveAttribute("lang", "en");
  });
});

test.describe("Crew navigation", () => {
  test.use({ asCrew: true });

  test("Crew pages load when logged in", async ({ page, layout }) => {
    await page.goto("/crew");
    await expect(page).toHaveURL(/\/crew$/);
    for (const path of crewPages) {
      await verifyPageLoaded(layout, path, { heading: "h2" });
      await expect(page).toHaveURL(new URL(path, page.url()).href);
    }
  });
});
