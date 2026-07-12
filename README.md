# WeihaoStudio AuthInk Keycloak Theme

水墨风格的 WeihaoStudio Keycloak 登录主题，使用 React、Vite、TypeScript、TailwindCSS 和 Keycloakify 构建。

## Compatibility

The theme is verified for the two isolated Homelab targets: production Keycloak **21.0.2 / Java 17** and test Keycloak **26.0.0 / Java 21**. Keycloakify 11 uses the login-only `all-other-versions` compatibility target, so both version-labelled JARs are intentionally byte-identical while retaining explicit deployment names.

## Commands

```bash
pnpm install
pnpm test:run
pnpm build
pnpm build-storybook
pnpm build-keycloak-theme
```

The deployable theme is generated under `dist_keycloak/`. `build-keycloak-theme` also refreshes the two version-labelled JARs and `SHA256SUMS` under `dist_keycloak/versioned/`; never reuse older files from that directory after rebuilding.

## Project structure

- `src/login/Login.tsx` — production `login.ftl` form wired to `kcContext.url.loginAction`.
- `src/login/Template.tsx` — AuthInk responsive authentication shell.
- `src/login/authink.tokens.css` — copied canonical Open Design token source.
- `src/login/authink.css` — approved preview CSS plus minimal production-shell overrides.
- `design-system/preview/index.html` — golden master for Login visual parity.
- `src/login/assets/` — approved local backgrounds, logos, brush artwork, and OAuth icons.
- `src/login/Login.stories.tsx` — deterministic visual states for Storybook.
- `src/login/components/InkLoading/` — accessible Canvas-based ink loading component, WebP runtime asset, stories and lifecycle tests.
- `scripts/package-versioned-themes.mjs` — refreshes the Keycloak 21.0.2 and 26.0.0 labelled deliverables from the current generic JAR.
- `design-system/` — copied canonical Open Design evidence and preview reference.

## Visual constraints

- Login uses the fixed approved light/dark 4K WebP wallpapers with no gradient fade or automatic wallpaper rotation.
- The logo, brush submit button, Google icon, and GitHub icon are not redrawn.
- At 767px and below the wallpaper fills the page and the form sits directly on it; no large card overlay, backdrop blur, border, radius, or panel shadow is introduced.
