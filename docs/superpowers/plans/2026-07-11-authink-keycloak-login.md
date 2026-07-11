# AuthInk Keycloak Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and validate a production-wired AuthInk `login.ftl` theme JAR for the verified Keycloak 26.0.0 test environment.

**Architecture:** Start from the official Keycloakify 11 starter, preserve its generated `kc.gen.tsx` entrypoint, and add a custom `Login` page plus project-owned template and styles. Keep approved assets local, use Keycloak context for all actions and provider URLs, and verify behavior with Vitest/Testing Library plus Storybook visual states.

**Tech Stack:** React 18, TypeScript, Vite 5, Keycloakify 11.15.x, pnpm, Vitest, Testing Library, Storybook 8.

---

## File map

- `package.json`, `pnpm-lock.yaml`: package scripts and reproducible dependency graph.
- `vite.config.ts`: Keycloakify plugin, theme name, login-only theme, Keycloak 25+ JAR target.
- `src/main.tsx`, `src/kc.gen.tsx`: production Keycloak entry and generated page binding.
- `src/login/KcPage.tsx`: page-ID dispatch and lazy fallback to Keycloakify defaults.
- `src/login/Login.tsx`: production login form markup and Keycloak behavior.
- `src/login/Login.test.tsx`: login action, messages, providers, and accessibility contract.
- `src/login/Template.tsx`: AuthInk shell shared by login states.
- `src/login/authink.tokens.css`: canonical token mapping.
- `src/login/authink.css`: responsive page and control styling.
- `src/login/assets/*`: approved local artwork.
- `src/login/KcPageStory.tsx`, `src/login/Login.stories.tsx`: deterministic Storybook contexts.
- `design-system/*`: copied canonical design evidence.

### Task 1: Bootstrap the official starter

**Files:**
- Create: starter files from `keycloakify/keycloakify-starter`
- Modify: `package.json`
- Create: `pnpm-lock.yaml`

- [ ] Copy the official starter snapshot into the repository without its `.git` directory and without overwriting `docs/`.
- [ ] Change package metadata to `weihaostudio-authink` and pin package management to pnpm.
- [ ] Add `test`, `test:run`, and `build-storybook` scripts plus Vitest/Testing Library dependencies.
- [ ] Run `pnpm install` and confirm lockfile generation.
- [ ] Commit with `chore: bootstrap Keycloakify theme`.

### Task 2: Add a failing production contract test

**Files:**
- Create: `src/login/Login.test.tsx`
- Create: `src/test/setup.ts`
- Modify: `vite.config.ts`

- [ ] Configure Vitest with `jsdom`, global test APIs, and `src/test/setup.ts`.
- [ ] Write a test rendering a `login.ftl` mock and assert the form action equals the mock `loginAction`, the username/password controls use Keycloak field names, a textual error uses `role="alert"`, and Google/GitHub links use provider URLs.
- [ ] Run `pnpm test:run -- src/login/Login.test.tsx` and verify it fails because the custom `Login` implementation does not exist.
- [ ] Commit with `test: define AuthInk login contract`.

### Task 3: Migrate canonical design evidence and assets

**Files:**
- Create: `design-system/DESIGN.md`
- Create: `design-system/USAGE.md`
- Create: `design-system/VALIDATION.md`
- Create: `design-system/tokens.css`
- Create: `design-system/preview/index.html`
- Create: `src/login/assets/*`
- Create: `src/login/authink.tokens.css`

- [ ] Copy approved files from the Open Design project, preserving filenames.
- [ ] Create the project token mapping with `--authink-*` primitives and semantic light/dark values sourced from canonical `tokens.css`.
- [ ] Add a test asserting light and dark background imports resolve to distinct filenames and OAuth icons are local modules.
- [ ] Run the test and verify the asset assertions pass while the login component assertions remain red.
- [ ] Commit with `feat: add approved AuthInk design assets`.

### Task 4: Implement the minimal production login page

**Files:**
- Create: `src/login/Login.tsx`
- Create: `src/login/Template.tsx`
- Modify: `src/login/KcPage.tsx`
- Create: `src/login/authink.css`

- [ ] Implement `Template` with distinct light/dark wallpapers, original logo lockups, responsive visual/form regions, accessible message area, and no mobile card overlay.
- [ ] Implement `Login` using `kcContext.url.loginAction`, realm feature flags, Keycloak messages, social provider links, password visibility, and duplicate-submit prevention.
- [ ] Dispatch `login.ftl` to the custom component while preserving Keycloakify default-page fallback for out-of-scope pages.
- [ ] Run `pnpm test:run -- src/login/Login.test.tsx` and verify all contract tests pass.
- [ ] Commit with `feat: implement AuthInk Keycloak login`.

### Task 5: Add visual states and responsive regression checks

**Files:**
- Modify: `src/login/KcPageStory.tsx`
- Create: `src/login/Login.stories.tsx`
- Modify: `src/login/Login.test.tsx`

- [ ] Add default, invalid-credentials, social-provider, and dark-mode Storybook stories using `getKcContextMock`.
- [ ] Add static CSS regression assertions: the mobile media query exists, `backdrop-filter` is absent, and mobile shell has no card border/shadow/radius.
- [ ] Run unit tests and `pnpm build-storybook`.
- [ ] Start Storybook and verify desktop, tablet, and mobile states in a browser with screenshots and console-error checks.
- [ ] Commit with `test: add AuthInk visual login states`.

### Task 6: Configure and verify the deployable theme

**Files:**
- Modify: `vite.config.ts`
- Modify: `README.md`
- Create: `.gitignore`

- [ ] Configure `themeName: "weihaostudio-authink"`, `accountThemeImplementation: "none"`, and a single `"25-and-above": "weihaostudio-authink.jar"` target for Keycloak 26.0.0.
- [ ] Document the verified test target and build commands without including secrets or production deployment instructions.
- [ ] Run `pnpm test:run`, `pnpm build`, `pnpm build-storybook`, and `pnpm build-keycloak-theme`.
- [ ] Inspect `dist_keycloak` and verify the JAR exists and contains the login theme resources.
- [ ] Run a clean git status and review the final diff.
- [ ] Commit with `build: package AuthInk theme for Keycloak 26`.
