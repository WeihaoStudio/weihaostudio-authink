# AuthInk remaining Keycloak themes — KC26 deployment record

Date: 2026-07-12
Branch: `feature/202607-authink-login`
Target: `192.168.200.10` / `keycloak-test-server-1` / Keycloak 26.0.0
Realm: `WeihaoStudio`

## Delivered theme coverage

- Login: AuthInk login, TOTP, verify-email, reset-password request, update-password, info and error pages.
- Account: Keycloakify Single-Page Account UI with native routes/behavior, AuthInk brand, restrained tokens and approved `夜/昼` switch.
- Email: native FreeMarker HTML and plain-text templates for email verification, password reset, execute-actions and identity-provider linking; UTF-8 Chinese subjects and copy.
- Admin: Keycloakify Admin UI 260601.0.1 with native administration screens, AuthInk brand/tokens and approved `夜/昼` switch.

## Final artifacts

- `dist_keycloak/versioned/weihaostudio-authink-keycloak-21.0.2.jar`
- `dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar`
- SHA-256 for both labels: `aea1c58a485ef5c3fb954ac3d7499fb6ca18448ca34711f7d8bbe136f87e4d5f`

JAR inventory for each artifact:

- login entries: 537
- account entries: 440
- email entries: 68
- admin entries: 428

AuthInk 4K/reference PNG originals are not packaged. The remaining PNG files are Keycloakify/default compatibility resources and generated favicons; production AuthInk artwork is WebP.

## Fresh verification evidence

- Vitest: 12 files, 40 tests passed.
- Storybook production build: passed.
- TypeScript + Vite + Keycloakify JAR build: passed.
- KC26 provider SHA equals the local final artifact SHA.
- KC26 restarted successfully with no theme/provider `ERROR` or `FATAL` entries.
- KC26 realm state:
  - login: `weihaostudio-authink`
  - account: `weihaostudio-authink`
  - admin: `weihaostudio-authink`
  - email: `weihaostudio-authink`
- `master` remains on Keycloak defaults (`keycloak`, `keycloak.v2`, `keycloak.v2`, `keycloak`).
- KC21 production realm state remains unchanged; no KC21 JAR or realm fields were modified in this phase.

## KC26 rollback points

- Account: `/home/weihao/docker/keycloak-theme-backups/20260712-185509-account/`
- Email: `/home/weihao/docker/keycloak-theme-backups/20260712-190350-email/`
- Admin/final JAR: `/home/weihao/docker/keycloak-theme-backups/20260712-191052-admin/`

Each directory contains the previous JAR and a `realm-theme-before.txt` snapshot. Restore both the JAR and the corresponding realm theme fields, then restart `keycloak-test-server-1`.

## Deliberate safety boundary

Authenticated Account/Admin walkthroughs and real outbound email delivery remain manual gates because the KC26 container bootstrap admin environment password is stale (`invalid_grant`) and no controlled test-user credential was available. The implementation did not reset/bypass administrator credentials or mutate credential tables.

The KC21-labelled artifact is built for later testing, but Account/Admin compatibility is not claimed. Per ADR 0002, KC21 production remains on native Account/Admin/Email themes until a separate authenticated KC21 validation is completed.
