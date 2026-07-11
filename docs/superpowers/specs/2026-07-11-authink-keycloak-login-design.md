# WeihaoStudio AuthInk Keycloak Login Theme Design

## Goal

Create an independent, Git-managed Keycloak login theme at `keycloak-themes/weihaostudio-authink` using React, Vite, TypeScript, TailwindCSS, Keycloakify, and pnpm. The first deliverable is a production-wired `login.ftl` experience and a deployable theme JAR compatible with the verified test environment, Keycloak 26.0.0.

## Approved design source

The canonical visual contract is the approved Open Design package at:

`/home/weihao/tools/open-design/.od/projects/77ee6114-7266-4e01-9d73-e681a24c1979/weihaostudio-auth-ink`

The implementation copies, without moving or redrawing:

- `DESIGN.md`, `USAGE.md`, and `VALIDATION.md` as design evidence;
- `tokens.css` as the source token vocabulary, mapped into project-owned `--authink-*` semantic tokens;
- approved local background, logo, brush-button, Google, and GitHub assets;
- `preview/index.html` only as a visual comparison reference, never as production component code.

The older static repository at `/home/weihao/agent-workspaces/WeihaoStudio/weihaostudio-authink` is evidence only. Its FreeMarker/CSS implementation is not copied into the new Keycloakify application.

## Architecture

Use the official Keycloakify 11 starter structure as the baseline. `src/main.tsx` renders generated `KcPage` from `window.kcContext`. `src/login/KcPage.tsx` dispatches Keycloak page IDs and customizes `login.ftl` first. A dedicated `Login.tsx` owns the login form semantics and submits directly to `kcContext.url.loginAction`.

The approved `design-system/preview/index.html` is the golden master for DOM shape, component classes, spacing, typography, controls, and responsive rules. Its authentication-shell CSS is copied into the React project with only asset-path and production-shell adaptations; it is not visually reinterpreted. TailwindCSS 4 is integrated through the Vite plugin for future engineering composition and page expansion, while the canonical preview CSS remains the source of truth for Login fidelity. The theme disables Keycloakify default CSS while retaining Keycloak data, error messages, provider URLs, and native form behavior.

Storybook stories provide deterministic `login.ftl` states for visual and interaction verification without a running Keycloak server, and browser screenshots are compared against the approved preview at matching viewports. Unit/component tests validate production-critical behaviors such as the form action, provider links, error semantics, theme resource separation, and mobile no-overlay constraints.

## Compatibility target

The isolated homelab test stack at `/home/weihao/docker/keycloak-test` was verified on July 11, 2026 to run **Keycloak 26.0.0**. The Vite plugin therefore targets the Keycloak 25-and-above JAR path supported by Keycloakify 11. Production directories, containers, and ports are out of scope.

## Login behavior

The login page supports:

- username or email input using the field name supplied by Keycloak;
- password input with an accessible visibility toggle;
- remember-me when the realm enables it;
- forgot-password when the realm enables it;
- form-level and field-level Keycloak messages;
- Google and GitHub social providers when supplied by `kcContext.social.providers`;
- keyboard-visible focus states;
- disabled submit state after submission to prevent duplicate requests;
- no JavaScript replacement for Keycloak's native form POST.

## Responsive visual behavior

- Desktop at 920px and above: two-column composition, landscape field on the left and form region on the right.
- Tablet: landscape header above the form.
- Mobile at 767px and below: approved wallpaper fills the full authentication page and the form is placed directly over it.
- Mobile must not introduce a large translucent card, backdrop blur, card shadow, container border, or rounded panel.
- Login uses the approved light 4K wallpaper as a fixed source image, with no gradient fade and no automatic light/dark wallpaper rotation.
- The primary submit button uses the approved brush artwork, not a CSS blob approximation.

## Out of scope

- Reset-password, TOTP, recovery-code, trusted-device, registration, and identity-provider detail pages.
- Redesigning or replacing approved visual assets.
- Deploying to or modifying the production Keycloak stack.
- Copying the static preview or legacy FreeMarker theme as production code.

## Acceptance criteria

1. `pnpm install`, tests, TypeScript/Vite build, Storybook build, and Keycloakify theme build pass.
2. A deployable JAR is generated for Keycloak 25 and above and is appropriate for the verified Keycloak 26.0.0 test target.
3. The login form posts to `kcContext.url.loginAction`.
4. Google and GitHub buttons use Keycloak-provided URLs and approved local SVG icons.
5. Login references only the approved light 4K wallpaper and applies no gradient fade or automatic wallpaper rotation.
6. At 320–767px there is no large card overlay or backdrop blur.
7. Errors have text/ARIA semantics and are not conveyed only through color.
8. Desktop, tablet, and mobile Storybook states visually match the approved AuthInk direction.
