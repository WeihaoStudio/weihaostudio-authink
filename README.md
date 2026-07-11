# WeihaoStudio AuthInk Keycloak Theme

水墨风格的 WeihaoStudio Keycloak 登录主题，使用 React、Vite、TypeScript 和 Keycloakify 构建。

## Compatibility

The isolated test stack at `192.168.200.10:/home/weihao/docker/keycloak-test` was verified on July 11, 2026 to run **Keycloak 26.0.0**. This project uses Keycloakify 11's login-only `all-other-versions` target and emits `weihaostudio-authink.jar`.

Production Keycloak is intentionally out of scope. Do not copy or deploy this JAR to production without a separate approval and validation cycle.

## Commands

```bash
pnpm install
pnpm test:run
pnpm build
pnpm build-storybook
pnpm build-keycloak-theme
```

The deployable theme is generated under `dist_keycloak/`.

## Project structure

- `src/login/Login.tsx` — production `login.ftl` form wired to `kcContext.url.loginAction`.
- `src/login/Template.tsx` — AuthInk responsive authentication shell.
- `src/login/authink.tokens.css` — project-owned `--authink-*` semantic token mapping.
- `src/login/assets/` — approved local backgrounds, logos, brush artwork, and OAuth icons.
- `src/login/Login.stories.tsx` — deterministic visual states for Storybook.
- `design-system/` — copied canonical Open Design evidence and preview reference.

## Visual constraints

- Light and dark modes use separate approved local background images.
- The logo, brush submit button, Google icon, and GitHub icon are not redrawn.
- At 767px and below the wallpaper fills the page and the form sits directly on it; no large card overlay, backdrop blur, border, radius, or panel shadow is introduced.
