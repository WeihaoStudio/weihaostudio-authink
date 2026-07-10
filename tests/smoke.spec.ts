import { expect, test } from "@playwright/test";

test("desktop login uses a true split-screen composition", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "desktop projects only");
  await page.goto("/?page=login&theme=light");
  const layout = page.locator(".authink-layout");
  const brand = page.locator(".authink-layout__brand");
  const auth = page.locator(".authink-layout__auth");

  await expect(layout).toBeVisible();
  const layoutBox = await layout.boundingBox();
  const brandBox = await brand.boundingBox();
  const authBox = await auth.boundingBox();

  expect(layoutBox).not.toBeNull();
  expect(brandBox).not.toBeNull();
  expect(authBox).not.toBeNull();
  expect(brandBox!.width).toBeGreaterThan(authBox!.width);
  expect(Math.abs(brandBox!.y - authBox!.y)).toBeLessThan(2);
});

test("login page exposes the approved OAuth copy", async ({ page }) => {
  await page.goto("/?page=login&theme=light");
  await expect(page.getByRole("button", { name: "使用 Google 登录" })).toBeVisible();
  await expect(page.getByRole("button", { name: "使用 GitHub 登录" })).toBeVisible();
  await expect(page.getByText(/继续 Google|继续 GitHub/)).toHaveCount(0);
});

test("TOTP supports six independent numeric positions", async ({ page }) => {
  await page.goto("/?page=totp&theme=light");
  const inputs = page.locator(".authink-totp__input");
  await expect(inputs).toHaveCount(6);
  for (let index = 0; index < 6; index += 1) {
    await inputs.nth(index).fill(String(index + 1));
  }
  await expect(inputs.nth(5)).toHaveValue("6");
});

test("mobile layout removes desktop brand copy and fills the viewport", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile project only");
  await page.goto("/?page=login&theme=light");
  await expect(page.locator(".authink-brand-copy")).toBeHidden();
  await expect(page.locator(".authink-card--hero")).toBeVisible();
  const cardBox = await page.locator(".authink-card--hero").boundingBox();
  expect(cardBox).not.toBeNull();
  expect(cardBox!.width).toBeGreaterThan(300);
});
