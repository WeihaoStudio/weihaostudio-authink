# AuthInk Remaining Keycloak Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete AuthInk coverage for the remaining Keycloak login flows, Account Theme, Email Theme, and Admin UI Theme with KC26-first validation and explicit rollback boundaries.

**Architecture:** Preserve Keycloak's authentication and account/admin behavior; customize presentation through narrowly scoped Keycloakify pages, shells, tokens, and email FreeMarker templates. Each phase produces an independently testable JAR and commit, is deployed first to the isolated KC26 test container, and does not advance to KC21 until compatibility is demonstrated.

**Tech Stack:** React 18, TypeScript, Keycloakify 11.15.11, TailwindCSS 4, Vitest, Testing Library, Storybook 8, FreeMarker, Keycloak 26.0.0 test and Keycloak 21.0.2 production.

---

## File structure and boundaries

- `src/login/`: individual AuthInk login-flow pages and the existing shared `Template`; no broad replacement of `DefaultPage`.
- `src/account/`: generated Keycloakify Account implementation with AuthInk shell/tokens layered over native behavior.
- `src/email/`: Keycloakify email source, HTML and plain-text templates, UTF-8 messages.
- `src/admin/`: generated Admin UI source; only KC26-compatible presentation changes until KC21 is separately proven.
- `src/theme/`: reusable AuthInk tokens only when a later theme needs them; login-specific CSS stays in `src/login/`.
- `docs/adr/`: decisions that affect version compatibility, especially Account implementation and Admin UI versioning.
- `docs/deployment/`: artifact hashes, backup paths, target container, verification evidence, and rollback commands.

## Phase 1 — Remaining Login flows (lowest risk)

### Task 1: Email verification page

**Files:**
- Create: `src/login/LoginVerifyEmail.tsx`
- Create: `src/login/LoginVerifyEmail.test.tsx`
- Create: `src/login/LoginVerifyEmail.stories.tsx`
- Modify: `src/login/KcPage.tsx`
- Modify: `src/login/Template.tsx`
- Modify: `src/login/authink.css`

- [ ] Write a failing Testing Library test that renders `login-verify-email.ftl` and asserts the AuthInk shell, title `确认你的邮箱`, current user email, resend URL from `kcContext.url.loginAction`, login URL from `kcContext.url.loginUrl`, and status/alert semantics.
- [ ] Run `pnpm exec vitest run src/login/LoginVerifyEmail.test.tsx`; expect failure because the page is still rendered by `DefaultPage`.
- [ ] Implement only the `login-verify-email.ftl` branch in `KcPage.tsx`, using `AuthInkTemplate`, `doUseDefaultCss={false}`, and Keycloak-provided URLs.
- [ ] Add Storybook states for default, missing-email compatibility, dark theme, and server message.
- [ ] Run the focused test and then `pnpm test:run`; expect all tests to pass.
- [ ] Commit as `feat: add AuthInk email verification page`.

### Task 2: Reset-password request page

**Files:**
- Create: `src/login/LoginResetPassword.tsx`
- Create: `src/login/LoginResetPassword.test.tsx`
- Create: `src/login/LoginResetPassword.stories.tsx`
- Modify: `src/login/KcPage.tsx`
- Modify: `src/login/authink.css`

- [ ] Write a failing test for username/email field naming, `url.loginResetCredentialsUrl`, attempted username, field errors, and return-to-login URL.
- [ ] Run the focused test and verify RED.
- [ ] Implement the minimal AuthInk form while preserving Keycloak field names and POST target.
- [ ] Add default, field-error, and email-as-username stories.
- [ ] Run focused and full tests; commit as `feat: add AuthInk password recovery request`.

### Task 3: Update-password page

**Files:**
- Create: `src/login/LoginUpdatePassword.tsx`
- Create: `src/login/LoginUpdatePassword.test.tsx`
- Create: `src/login/LoginUpdatePassword.stories.tsx`
- Modify: `src/login/KcPage.tsx`

- [ ] Write failing tests for `password-new`, `password-confirm`, password visibility eye controls, logout-other-sessions checkbox when provided, field messages, and `url.loginAction`.
- [ ] Verify RED, implement minimal Keycloak-compatible form, verify GREEN.
- [ ] Add stories for normal, policy-error, and app-initiated-action states.
- [ ] Commit as `feat: add AuthInk password update page`.

### Task 4: Info and error result pages

**Files:**
- Create: `src/login/Info.tsx`
- Create: `src/login/Info.test.tsx`
- Create: `src/login/Info.stories.tsx`
- Create: `src/login/Error.tsx`
- Create: `src/login/Error.test.tsx`
- Create: `src/login/Error.stories.tsx`
- Modify: `src/login/KcPage.tsx`

- [ ] Write failing tests for sanitized server content and URL precedence: `pageRedirectUri`, `actionUri`, then `client.baseUrl`; respect `skipLink`.
- [ ] Write failing error-page tests for sanitized summary, `client.baseUrl`, and `skipLink`.
- [ ] Implement isolated branches using `AuthInkTemplate`; do not alter remaining `DefaultPage` flows.
- [ ] Run focused and full tests; commit as `feat: add AuthInk login result pages`.

### Task 5: Phase 1 artifact and KC26 gate

**Files:**
- Create: `docs/deployment/2026-07-12-login-flows-kc26.md`

- [ ] Run `pnpm test:run`, `pnpm build-storybook`, and `pnpm build-keycloak-theme`.
- [ ] Confirm the JAR includes only referenced WebP/static assets and retains no unreferenced PNG originals.
- [ ] Record SHA-256 and copy the prior KC26 JAR to a timestamped backup directory.
- [ ] Deploy only to `keycloak-test-server-1`, restart it, and verify the real verify-email/reset/update/info/error flows.
- [ ] If any check fails, restore the backup JAR and stop; do not deploy KC21.
- [ ] Commit evidence as `docs: record KC26 login flow verification` and push the branch.

## Phase 2 — Account Theme

### Task 6: Account implementation ADR and scaffold

**Files:**
- Create: `docs/adr/0001-keycloak-account-theme-implementation.md`
- Generated/modify: `src/account/**`
- Modify: `vite.config.ts`

- [ ] Record the decision to start with Keycloakify Account Multi-Page if its generated capability covers KC21/KC26 required routes; otherwise document why Single-Page is required.
- [ ] Run the selected `keycloakify initialize-account-theme` interactively and inspect the generated diff before accepting it.
- [ ] Build immediately without AuthInk changes to establish a clean baseline.
- [ ] Commit the generator-only scaffold separately as `build: initialize Keycloak account theme`.

### Task 7: AuthInk Account shell and visual coverage

**Files:**
- Modify: `src/account/**` generated entry/template files
- Create: `src/account/authink-account.css`
- Create: `src/account/*.test.tsx` for changed behavior
- Create: `src/account/*.stories.tsx` where supported

- [ ] Write failing tests for native route rendering, form actions, CSRF/state fields, keyboard navigation, and AuthInk theme toggle.
- [ ] Apply only shell, tokens, typography, surfaces, and brand; retain generated/native business components.
- [ ] Verify profile, password, TOTP, sessions, linked accounts, and device/recovery surfaces available in the selected implementation.
- [ ] Run full tests/build and commit as `feat: apply AuthInk account theme`.

### Task 8: KC26 Account gate

- [ ] Backup KC26 JAR and realm theme fields.
- [ ] Deploy JAR, set only the KC26 `WeihaoStudio` realm `account_theme`, and exercise the Account Console end-to-end.
- [ ] Restore both JAR and realm field on failure.
- [ ] Record evidence and push; do not change KC21 yet.

## Phase 3 — Email Theme

### Task 9: Email scaffold and AuthInk templates

**Files:**
- Generated/modify: `src/email/**`
- Create/modify: HTML and text FreeMarker templates and UTF-8 message bundles under the generated email theme structure
- Create: `src/email/email-theme.test.ts`

- [ ] Initialize with `pnpm exec keycloakify initialize-email-theme` and commit generator output separately.
- [ ] Write failing static/template tests for verification, reset-password, execute-actions, identity-provider link, and event notifications: required `${link}`/Keycloak variables, HTML escaping, text alternatives, and UTF-8 Chinese subjects.
- [ ] Implement table/simple-layout HTML with inline CSS; do not use Canvas, JavaScript, remote fonts, or background-image-dependent content.
- [ ] Run tests and build; inspect JAR for `theme/weihaostudio-authink/email/`.
- [ ] Commit as `feat: add AuthInk email theme`.

### Task 10: KC26 Email gate

- [ ] Backup JAR and KC26 realm `email_theme` value.
- [ ] Deploy and trigger real verification and reset-password emails to a controlled mailbox/sink.
- [ ] Verify subject, HTML, plain text, expiry copy, link validity, and no mojibake.
- [ ] Roll back on failure; otherwise record evidence and push.

## Phase 4 — Admin UI Theme (highest risk)

### Task 11: Admin compatibility ADR and KC26 scaffold

**Files:**
- Create: `docs/adr/0002-keycloak-admin-theme-versioning.md`
- Generated/modify: `src/admin/**`
- Modify: `vite.config.ts` and packaging only if separate version targets are required

- [ ] Initialize the Admin Theme and commit generator output separately.
- [ ] Audit generated Keycloak/PatternFly dependencies against KC26 and KC21 before visual changes.
- [ ] Decide and document one of: KC26-only Admin bundle with KC21 native fallback, or distinct KC21/KC26 artifacts. Never assume one untested bundle supports both.

### Task 12: AuthInk Admin presentation layer

**Files:**
- Modify only generated Admin shell/navigation/theme files
- Create: `src/admin/authink-admin.css`
- Add focused tests for changed navigation/theme behavior

- [ ] Write failing tests for route preservation, navigation accessibility, theme toggle, and unchanged admin API interaction boundaries.
- [ ] Apply AuthInk tokens, shell, typography, and brand while retaining Keycloak Admin Console CRUD components.
- [ ] Build and verify the user-list/invite-user visual targets from OpenDesign without replacing functional screens with static HTML.
- [ ] Commit as `feat: apply AuthInk admin theme`.

### Task 13: Admin deployment gates and finalization

- [ ] Backup and deploy to KC26; set only KC26 `admin_theme`; test users, realms, clients, groups, roles, sessions, and events.
- [ ] Evaluate KC21 separately using the ADR-selected artifact/fallback; do not change production unless all required flows pass.
- [ ] Run final `pnpm test:run`, Storybook build, Keycloak theme build, JAR inventory, and SHA-256 checks.
- [ ] Record both artifact hashes, backup locations, realm-field changes, and exact rollback commands.
- [ ] Commit and push the feature branch; do not merge.

## Global stop conditions

- Stop and roll back if the container is unhealthy, Keycloak startup logs show provider/theme errors, a native form action or hidden state is lost, or the expected page falls back unexpectedly.
- Do not build on Homelab, print credentials, delete source PNG references, package unreferenced originals into JARs, or mutate KC21 before the corresponding KC26 gate passes.
- Theme toggle behavior remains the existing `夜/昼` implementation and is the visual source of truth when OpenDesign differs.
