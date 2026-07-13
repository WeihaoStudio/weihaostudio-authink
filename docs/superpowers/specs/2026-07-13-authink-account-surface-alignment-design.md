# AuthInk Account Surface Alignment Design

**Date:** 2026-07-13  
**Status:** Approved by the standing instruction to continue remaining themes in minimum-risk order  
**Scope:** Account Theme presentation only

## 1. Problem

The current Account Theme uses the correct AuthInk token family and roughly matches the OpenDesign 256px sidebar direction, but it still reads as a translucent console rather than the restrained paper/surface interface shown in `account.html`.

The largest fidelity gaps are:

1. Masthead and cards apply `backdrop-filter` and translucent `color-mix` surfaces.
2. Main content starts too close to the masthead and lacks the OpenDesign heading rhythm.
3. Content width is governed by native PatternFly layout instead of an explicit 1080px reading measure.
4. Selected navigation uses an elevated card treatment where OpenDesign uses a quieter selected surface.
5. The theme toggle remains glassy even though Account should use solid surfaces.

## 2. Goals

- Remove glass/translucent treatment from Account masthead, sidebar, cards, tables, and theme toggle.
- Align the desktop workspace with OpenDesign's `max-width: 1080px`, generous top whitespace, and restrained surface hierarchy.
- Preserve every native Account route, form action, API call, navigation item, keyboard interaction, and responsive behavior.
- Keep the change CSS-first and independently reversible.
- Validate on KC26 before considering KC21 promotion.

## 3. Non-goals

- Rebuilding Account navigation or route architecture.
- Introducing Login wallpaper or Login form glass styling into Account.
- Replacing PatternFly Account components with bespoke React components.
- Changing account data, credentials, realm settings, or user state for visual acceptance.
- Expanding this phase into Admin or Email Theme work.

## 4. Considered approaches

### A. CSS-only surface and spacing alignment — selected

Keep the generated Keycloakify Account DOM and apply narrowly scoped rules beneath `.authink-account`.

**Benefits**

- Smallest rollback and compatibility surface.
- Preserves native KC26/KC21 business behavior.
- Can be verified through deterministic CSS contract tests and real browser geometry.

**Trade-off**

- Cannot reproduce every bespoke OpenDesign composition exactly because native route content remains authoritative.

### B. Replace the Account shell

Rebuild the masthead/sidebar/content shell around native route outlets.

**Rejected for this phase:** higher focus, responsive, route, and version-compatibility risk.

### C. Route-specific visual wrappers

Add custom wrapper markup around profile, security, devices, and applications pages.

**Deferred:** potentially improves fidelity, but multiplies regression points and should only follow evidence from the CSS-only KC26 acceptance.

## 5. Visual design

### 5.1 Shell

- Canvas remains `var(--color-canvas)`.
- Sidebar remains 256px on desktop, uses opaque `var(--color-surface)`, and retains the subtle divider.
- Masthead uses opaque `var(--color-surface)` with a subtle bottom border and no blur.
- No wallpaper, pseudo-wallpaper, or backdrop filtering is used anywhere in Account.

### 5.2 Main workspace

- Main content receives desktop padding equivalent to OpenDesign: top spacing in the 72–96px range, fluid horizontal spacing, and 64px bottom spacing.
- The content measure is capped at 1080px.
- Native page headings retain their semantic structure; CSS adjusts typography/spacing only.
- Route contents remain left-aligned within the workspace rather than centered as a login card.

### 5.3 Navigation

- Hover uses `var(--color-surface-muted)`.
- Current navigation uses a solid, quiet selected surface, AuthInk text color, and semibold weight.
- Selection must not depend on glass, glow, or animated movement.
- Responsive horizontal navigation remains native and horizontally scrollable.

### 5.4 Cards, tables, and controls

- Cards/modals use opaque `var(--color-surface)`, subtle border, `var(--radius-lg)`, and `var(--shadow-card)`.
- Tables use the same opaque surface hierarchy; headers use `var(--color-surface-subtle)`.
- Inputs and buttons retain the existing token mapping and native control semantics.
- Theme toggle becomes an opaque compact control and must not move vertically on hover.

### 5.5 Light and dark themes

- Both themes use the same structural rules and token names.
- Dark theme must not reintroduce transparency to obtain contrast.
- Contrast comes from canonical surface, border, and text tokens only.

## 6. Implementation boundaries

Expected implementation changes are limited to:

- `src/account/authink-account.css`
- `src/account/AccountThemeStyles.test.ts`

React files should remain unchanged unless real KC26 DOM evidence proves a CSS selector cannot safely express the approved layout. Any such need requires a separate review before editing JSX.

## 7. Tests

CSS contract tests must fail before the implementation and then verify:

1. No `backdrop-filter` or `-webkit-backdrop-filter` exists in Account CSS.
2. Masthead, sidebar, cards, tables, and theme toggle use opaque canonical surfaces.
3. Main workspace includes a 1080px maximum content width.
4. Desktop spacing includes larger top whitespace.
5. Current navigation remains solid and semibold.
6. Responsive sidebar-to-horizontal-nav rules remain present.
7. Account selectors remain scoped under `.authink-account` except the dedicated toggle class.

Existing route, branding, theme-toggle, build, Storybook, and packaging tests must remain green.

## 8. Acceptance and rollout

### Local gate

- Targeted Account tests.
- Full `pnpm test:run`.
- `pnpm build-storybook`.
- `pnpm build-keycloak-theme`.
- `pnpm test:packaging`.
- Independent Reviewer checks the diff against OpenDesign.

### KC26 gate

- Back up the deployed JAR and record all realm theme fields.
- Deploy only to `keycloak-test-server-1` first.
- Use an existing authenticated session for a read-only walkthrough.
- Verify at least personal info, account security/signing in, device activity, applications, light/dark toggle, keyboard focus, and responsive layout.
- Do not reset credentials or mutate user/realm data for acceptance.

### Promotion

KC21 is not changed until KC26 evidence is accepted. Promotion reuses the exact verified JAR hash and creates a separate rollback backup.

## 9. Rollback

This phase is independently reversible by either:

1. reverting the Account alignment commit and rebuilding; or
2. restoring the timestamped pre-deployment JAR on KC26.

Realm theme fields should not change during this phase because the Account theme is already selected.
