import { expect, test } from "@playwright/test";

const pages = [
  ["login-error", "用户名或密码错误，请重试。"],
  ["reset", "重置密码"],
  ["recovery", "使用恢复码登录"],
  ["success", "身份验证成功"],
] as const;

for (const [pageName, expectedText] of pages) {
  test(`${pageName} state is rendered`, async ({ page }) => {
    await page.goto(`/?page=${pageName}&theme=light`);
    await expect(page.getByText(expectedText, { exact: false }).first()).toBeVisible();
    await expect(page.locator(".authink-card--hero")).toBeVisible();
  });
}

test("dark recovery state keeps the night landscape", async ({ page }) => {
  await page.goto("/?page=recovery&theme=dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".authink-page__landscape-image")).toHaveAttribute("src", "/assets/ink-landscape-dark.svg");
});
