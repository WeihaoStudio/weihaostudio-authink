# AuthInk InkLoading centered submit stage — KC26 deployment record

Date: 2026-07-13  
Branch: `feature/202607-authink-login`  
Commit: `654d4e4`  
Target: `192.168.200.10` / `keycloak-test-server-1` / Keycloak 26.0.0

## Scope

- Login and OTP/TOTP submission feedback only.
- Replaced the 20px inline spinner/text group with a reusable 64px centered InkLoading stage.
- The disabled native submit button and the live status region are siblings in one grid slot; the live region is not inside the disabled control.
- Draw timing is `3000 / 600 / 3600 / 280ms` with balanced `easeInOutSine` reveal; no rotation.
- Account, Admin and Email source files and realm configuration were not changed.

## Verification

- `pnpm test:run`: 20 files / 68 tests passed.
- `pnpm build-storybook`: passed.
- `pnpm build-keycloak-theme`: passed.
- `pnpm test:packaging`: 2 tests passed.
- KC26 deployed/local version-labelled JAR SHA-256:
  `631eed3f83761599a457da12f84ac5d64a6c2347632bde0161d2426cee58ea7d`.
- Realm theme fields remained `weihaostudio-authink` for login/account/admin/email on both `master` and `WeihaoStudio`.
- Restart-scoped logs contained no `ERROR`, `FATAL`, `TemplateNotFoundException`, or `FreeMarkerException`.

## Browser evidence

The real KC26 `WeihaoStudio` Account Console login redirect was opened in a fresh headless browser. Form navigation was prevented locally before clicking submit, so no authentication request was sent.

- Submit button: `338 × 112px`.
- Submit slot: `338 × 112px`.
- Status stage: `338 × 112px`.
- InkLoading: `64 × 64px`.
- Ink center minus stage center on the horizontal axis: `0px`.
- Status region is not a descendant of the disabled button.
- Light theme: black ink and readable status text.
- Dark theme: `invert(1) brightness(1.08)` ink filter and inverse readable status text.
- Reduced-motion browser emulation produced a stable full-ring pixel count (`840 → 840`).

A pre-existing browser console warning (`Need KcContext polyfill for referrerName`) was observed; it was present outside this loading-state change and did not block rendering or submission-state verification.

## Rollback

Valid backup:

`/home/weihao/docker/keycloak-theme-backups/20260713-044644-inkloading-center/`

It contains:

- the previous KC26 JAR (`SHA-256 2d6fc18a43439a075daaf052435434433d4b8aa5057614090bc7e3059145a6bd`);
- `realm-theme-before.txt` for `master` and `WeihaoStudio`;
- `jar-before.sha256`.

The earlier directory ending in `-incomplete` has no valid realm snapshot and must not be used.

## Safety boundary

KC21 production was not modified. Promotion to KC21 remains a separate acceptance step.
