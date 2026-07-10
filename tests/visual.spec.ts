import { expect, test } from "@playwright/test";

async function prepareStableCapture(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `
      .authink-preview-nav { display: none !important; }
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
}

for (const theme of ["light", "dark"] as const) {
  test(`login ${theme} visual parity`, async ({ page }) => {
    await page.goto(`/?page=login&theme=${theme}`);
    await prepareStableCapture(page);
    await expect(page.locator(".authink-page")).toHaveScreenshot(`login-${theme}.png`, {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });

  test(`totp ${theme} visual parity`, async ({ page }) => {
    await page.goto(`/?page=totp&theme=${theme}`);
    await prepareStableCapture(page);
    await expect(page.locator(".authink-page")).toHaveScreenshot(`totp-${theme}.png`, {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.002,
    });
  });
}

test("mobile login keeps independent composition", async ({ page }) => {
  await page.goto("/?page=login&theme=light");
  await prepareStableCapture(page);
  const card = page.locator(".authink-card--hero");
  await expect(card).toBeVisible();
  await expect(card).toHaveScreenshot("mobile-login-card.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.002,
  });
});
