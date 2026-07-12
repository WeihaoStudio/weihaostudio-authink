# AuthInk Authenticated Shells Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Keycloak Account and Admin visually and behaviorally coherent with the verified AuthInk Login and the OpenDesign authenticated-page baselines.

**Architecture:** Keep Keycloakify's Account/Admin routing, APIs, and PatternFly components intact. Add AuthInk shell contracts at the existing Account wrapper and PatternFly Admin root: shared wallpaper/token state, semantic glass surfaces, navigation/header treatment, content/table/form mappings, and responsive overrides. Theme state remains non-persistent and reflects Keycloak `darkMode=false` exactly.

**Tech Stack:** React, TypeScript, Keycloakify 11, Keycloak Account/Admin UI packages, PatternFly v5, Vite, Vitest, OpenDesign AuthInk tokens/assets.

---

## File structure

- Modify: `src/account/KcAccountUi.tsx` — install semantic wrapper attributes and synchronized theme assets.
- Modify: `src/account/authink-account.css` — replace broad transparent overrides with Account shell, nav, header, content, table and responsive mappings.
- Modify: `src/account/colorScheme.ts` — correct non-persistent and `darkMode=false` state handling.
- Modify: `src/account/AccountThemeToggle.tsx` — remove stale storage behavior and use the shared theme control contract.
- Create: `src/account/AccountThemeStyles.test.ts` — assert the Account shell CSS contract.
- Modify: `src/admin/KcAdminUi.tsx` — expose an AuthInk Admin root shell / backdrop layer without replacing routes.
- Modify: `src/admin/index.css` — map PatternFly masthead/sidebar/main/card/table/modal/form controls to the AdminUI baseline.
- Modify: `src/admin/PageHeader.tsx` — select the correct light/dark logo according to live AuthInk theme.
- Modify: `src/admin/PageNav.tsx` and `src/admin/page-nav.css` — add sidebar caption / semantic nav classes and align nav density.
- Modify: `src/admin/colorScheme.ts`, `src/admin/AdminThemeToggle.tsx` — preserve the non-persistent theme contract and emit an update signal for logo changes.
- Modify: `src/admin/*.test.ts[x]` — update unit tests for theme and logo behavior.

## Task 1: Lock the Account theme-state contract

**Files:**
- Modify: `src/account/colorScheme.ts`
- Modify: `src/account/AccountThemeToggle.tsx`
- Modify: `src/account/AccountThemeToggle.test.tsx`
- Create: `src/account/colorScheme.test.ts`

- [ ] **Step 1: Write failing tests for no storage and `darkMode="false"`**

```ts
it.each([false, "false"])("forces light mode when darkMode is %p", darkMode => {
  localStorage.setItem("authink-account-theme", "dark");
  getKcContext.mockReturnValue({ kcContext: { darkMode } });
  startColorSchemeManagement();
  expect(document.documentElement).toHaveAttribute("data-authink-theme", "light");
});
```

- [ ] **Step 2: Run the focused Account tests**

Run: `pnpm vitest run src/account/AccountThemeToggle.test.tsx src/account/colorScheme.test.ts`

Expected: FAIL because the current Account code consults persistent storage or treats string `"false"` as enabled.

- [ ] **Step 3: Implement the non-persistent Account theme state**

```ts
export function getPreferredAccountTheme(): AccountTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

if (kcContext.darkMode === false || String(kcContext.darkMode) === "false") {
  applyAccountTheme("light");
  return;
}
```

Remove the legacy storage key when `AccountThemeToggle` mounts; toggle only React state.

- [ ] **Step 4: Re-run focused Account tests**

Run: `pnpm vitest run src/account/AccountThemeToggle.test.tsx src/account/colorScheme.test.ts`

Expected: PASS.

## Task 2: Implement the Account OpenDesign shell mapping

**Files:**
- Modify: `src/account/KcAccountUi.tsx`
- Modify: `src/account/authink-account.css`
- Create: `src/account/AccountThemeStyles.test.ts`

- [ ] **Step 1: Write failing Account style-contract tests**

```ts
expect(css).toContain(".authink-account::before");
expect(css).toMatch(/\.pf-v5-c-page__sidebar/);
expect(css).toMatch(/\.pf-v5-c-masthead/);
expect(css).toMatch(/\.pf-v5-c-card/);
expect(css).toMatch(/backdrop-filter:\s*blur/);
```

- [ ] **Step 2: Run the style test**

Run: `pnpm vitest run src/account/AccountThemeStyles.test.ts`

Expected: FAIL until the shell is mapped to Account's actual PatternFly DOM.

- [ ] **Step 3: Add the Account shell CSS**

Create a fixed `::before` wallpaper layer inside `.authink-account`; preserve `z-index` isolation. Map `.pf-v5-c-page__sidebar`, `.pf-v5-c-masthead`, `.pf-v5-c-page__main-section`, `.pf-v5-c-card`, `.pf-v5-c-table`, `.pf-v5-c-modal-box`, form controls and navigation items to semantic AuthInk surfaces. Use the original background image variables already injected by `KcAccountUi`, not hard-coded output asset paths.

- [ ] **Step 4: Add responsive Account rules**

At `max-width: 1024px`, collapse sidebar borders/density without obscuring content; at `max-width: 768px`, keep the 44px toggle clear of the masthead and use 20px content padding.

- [ ] **Step 5: Run focused Account contract tests**

Run: `pnpm vitest run src/account/AccountThemeStyles.test.ts src/account/AccountThemeToggle.test.tsx src/account/colorScheme.test.ts`

Expected: PASS.

## Task 3: Make Admin shell semantics complete

**Files:**
- Modify: `src/admin/KcAdminUi.tsx`
- Modify: `src/admin/index.css`
- Modify: `src/admin/AdminThemeStyles.test.ts`

- [ ] **Step 1: Extend the failing Admin visual contract**

```ts
expect(css).toMatch(/\.pf-v5-c-page__sidebar[^}]*width|inline-size/s);
expect(css).toMatch(/\.pf-v5-c-nav__link[^}]*border-radius/s);
expect(css).toMatch(/\.pf-v5-c-table thead|\.pf-v5-c-table th/);
expect(css).toMatch(/@media \(max-width: 1024px\)/);
```

- [ ] **Step 2: Run the Admin visual contract test**

Run: `pnpm vitest run src/admin/AdminThemeStyles.test.ts`

Expected: FAIL because current CSS provides generic glass surfaces but not the complete AdminUI navigation/table/responsive contract.

- [ ] **Step 3: Add a root shell marker and backdrop ownership**

Wrap `AdminThemeToggle` and `RouterProvider` in `div.authink-admin`; ensure the fixed wallpaper layer sits behind every PatternFly route and does not interfere with modal overlays or pointer events.

- [ ] **Step 4: Implement AdminUI PatternFly mappings**

Map sidebar to the OpenDesign 256px desktop rail; map masthead to the Admin topbar; map active and hover nav links; map main workspace padding, breadcrumbs, title/description; map table headers/cells/rows, cards, controls, alerts and modal surfaces. Use CSS variables for light/dark colors and keep Keycloak interaction selectors unchanged.

- [ ] **Step 5: Implement responsive mappings**

At `max-width: 1024px`, let PatternFly control the collapsible sidebar while preserving transparent shells. At `max-width: 768px`, make masthead content stack safely and leave 76px right inset for the theme control.

- [ ] **Step 6: Re-run Admin contract tests**

Run: `pnpm vitest run src/admin/AdminThemeStyles.test.ts src/admin/AdminThemeToggle.test.tsx src/admin/colorScheme.test.ts`

Expected: PASS.

## Task 4: Synchronize theme-aware branding

**Files:**
- Modify: `src/admin/colorScheme.ts`
- Modify: `src/admin/PageHeader.tsx`
- Create: `src/admin/adminThemeBranding.ts`
- Create: `src/admin/adminThemeBranding.test.ts`

- [ ] **Step 1: Write a failing pure logo-selection test**

```ts
expect(getAdminBrandLogoUrl({ theme: "light", customLogo: undefined })).toBe(authInkAssets.logoInkUrl);
expect(getAdminBrandLogoUrl({ theme: "dark", customLogo: undefined })).toBe(authInkAssets.logoWhiteUrl);
```

- [ ] **Step 2: Run the test**

Run: `pnpm vitest run src/admin/adminThemeBranding.test.ts`

Expected: FAIL because there is no pure brand selector and the header always picks the white logo.

- [ ] **Step 3: Implement the selector and live theme subscription**

`applyAdminTheme` must dispatch `authink-theme-change` after setting `data-authink-theme`. `PageHeader` subscribes to that event and rerenders the standard Brand source; custom realm preview logos continue to win over AuthInk defaults.

- [ ] **Step 4: Run branding and theme tests**

Run: `pnpm vitest run src/admin/adminThemeBranding.test.ts src/admin/AdminThemeToggle.test.tsx src/admin/colorScheme.test.ts`

Expected: PASS.

## Task 5: Local quality gate and isolated KC26 deployment

**Files:**
- Verify: `src/account/**`, `src/admin/**`, `tests/**`
- Build: `dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar`

- [ ] **Step 1: Run complete local validation**

Run:

```bash
pnpm test:run
pnpm build-storybook
pnpm build-keycloak-theme
pnpm test:packaging
git diff --check
```

Expected: all pass; JAR has no `*.test.ts` sources.

- [ ] **Step 2: Build an isolated KC26 candidate**

Start from `338e84e`, overlay only approved Admin/Account files, run `pnpm install --offline --frozen-lockfile`, then build locally. Do not include unaccepted Email changes.

- [ ] **Step 3: Back up and deploy only to KC26**

Back up `/opt/keycloak/providers/weihaostudio-authink-keycloak-26.0.0.jar` and master/WeihaoStudio theme fields under `/home/weihao/docker/keycloak-theme-backups/<timestamp>-authenticated-shells/`; copy the candidate JAR into `keycloak-test-server-1`; restart only that container.

- [ ] **Step 4: Verify runtime artifacts and navigation**

Poll `http://192.168.200.10:8180/realms/master/.well-known/openid-configuration` to 200, compare deployed/local SHA256, inspect new post-restart logs, then manually verify Login, Account, and Admin desktop/tablet/phone plus light/dark. Do not touch KC21 production in this task.

## Task 6: Reviewer gate and source-control checkpoint

**Files:**
- Modify: reviewer evidence under `docs/deployment/`

- [ ] **Step 1: Run independent Account reviewer**

Reviewer must inspect authenticated Account appearance against `ui_kits/app/account.html`, confirm no P0/P1 remains, and verify no KC21 compatibility claim is made.

- [ ] **Step 2: Run independent Admin reviewer**

Reviewer must inspect Admin appearance against `ui_kits/app/admin-ui.html`, confirm wallpaper/nav/topbar/table/branding/theme behavior, and list only genuine P0/P1 blockers.

- [ ] **Step 3: Commit approved source changes without merge**

```bash
git add src/account src/admin docs/superpowers/plans/2026-07-12-authink-authenticated-shells.md
git commit -m "feat: align authenticated AuthInk shells"
git push origin feature/202607-authink-login
```

Expected: branch pushed; no merge and no KC21 production mutation.
