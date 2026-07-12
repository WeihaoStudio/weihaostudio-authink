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
- SHA-256 for both labels: `18ea2eb8071e5a75da2c90aad8de7bd81fe575cc0d7726a5df751221899e59ef`

JAR inventory for each artifact:

- login entries: 537
- account entries: 440
- email entries: 68
- admin entries: 428

AuthInk 4K/reference PNG originals are not packaged. The remaining PNG files are Keycloakify/default compatibility resources and generated favicons; production AuthInk artwork is WebP.

## Fresh verification evidence

- Vitest: 13 files, 44 tests passed.
- Storybook production build: passed.
- TypeScript + Vite + Keycloakify JAR build: passed.
- Deterministic packaging test: passed; repeated packaging of equivalent content produced the same SHA-256.
- KC26 provider SHA equals the local final artifact SHA.
- KC26 restarted successfully with no theme/provider `ERROR` or `FATAL` entries.
- KC26 realm state:
  - login: `weihaostudio-authink`
  - account: `weihaostudio-authink`
  - admin: `weihaostudio-authink`
  - email: `weihaostudio-authink`
- `master` uses `weihaostudio-authink` for login, account, admin and email. Its prior `admin_theme=base` setting caused Admin Console HTTP 500 because `base/admin` does not provide `index.ftl`; the field was changed to `weihaostudio-authink` and verified after restart.
- KC21 production realm state remains unchanged; no KC21 JAR or realm fields were modified in this phase.

## KC26 rollback points

- Account: `/home/weihao/docker/keycloak-theme-backups/20260712-185509-account/`
- Email: `/home/weihao/docker/keycloak-theme-backups/20260712-190350-email/`
- Admin/final JAR: `/home/weihao/docker/keycloak-theme-backups/20260712-191052-admin/`
- Reproducible-package deployment: `/home/weihao/docker/keycloak-theme-backups/20260712-112247-reproducible-package/`
- Final full-build deployment: `/home/weihao/docker/keycloak-theme-backups/20260712-112956-final-build/`
- Master Admin theme field correction: `/home/weihao/docker/keycloak-theme-backups/20260712-120741-master-admin-theme/`
- Final Admin masthead identity fix: `/home/weihao/docker/keycloak-theme-backups/20260712-124951-admin-masthead-getter-facade/`

Each directory contains the previous JAR and a `realm-theme-before.txt` snapshot. Restore both the JAR and the corresponding realm theme fields, then restart `keycloak-test-server-1`.

## Deliberate safety boundary

Authenticated Account walkthroughs and real outbound email delivery remain manual gates. KC26 Admin Console was authenticated through the user's existing browser session without resetting/bypassing credentials, mutating credential tables, or changing permissions.

The KC21-labelled artifact is built for later testing, but Account/Admin compatibility is not claimed. Per ADR 0002, KC21 production remains on native Account/Admin/Email themes until a separate authenticated KC21 validation is completed.

## Reproducible packaging follow-up

A fresh rebuild exposed that the upstream Keycloakify JAR carries current ZIP entry timestamps. The version-packaging step now rewrites entries in sorted order with a fixed ZIP timestamp and deterministic DEFLATE settings before producing the version-labelled JARs. This guarantees stable version-labelled artifacts when packaging the same source JAR; it does not claim that separate Vite/Keycloakify full builds emit identical chunk contents.

Verification:

- `node --test scripts/deterministic-jar.node-test.mjs`: passed.
- Two consecutive `pnpm package-versioned-themes` runs against the same source JAR produced identical SHA-256: `b72bfa8fa33dedb297ec61fe9f254480a916967ec5a19d470f93be0c981dd9de`.
- The final normalized full-build JAR was deployed to KC26; local and runtime SHA-256 match.
- KC26 realm discovery, Account entry and Admin Console entry returned HTTP 200.
- Account and Admin HTML reference `account/weihaostudio-authink` and `admin/weihaostudio-authink` resources respectively.
- No recent theme/provider `ERROR` or `FATAL` log entries were found.

Two failed backup attempts were retained but renamed with `-incomplete`; their realm snapshots are empty and they must not be used for rollback. The valid rollback points are `20260712-112247-reproducible-package` and `20260712-112956-final-build`; prefer the latest `112956` snapshot for the current runtime.

## KC26 Admin Console correction and authenticated acceptance

Two independent issues were corrected with separate rollback points:

1. `master.admin_theme=base` caused `TemplateNotFoundException: index.ftl` and HTTP 500. The minimal configuration correction set `master.admin_theme=weihaostudio-authink`. Both master and WeihaoStudio Admin entry pages now return HTTP 200 and reference `admin/weihaostudio-authink`.
2. The masthead displayed `Anonymous` even though `whoami` returned HTTP 200 with `displayName=weihao li`. KC26's ID token contained `name` and `username`, but the upstream shared Masthead recognizes only `given_name`, `family_name`, or `preferred_username`. `PageHeader` now passes a non-mutating getter-safe facade that adds `preferred_username` only when no Masthead-supported identity claim exists. The live `oidc-spa` client, token, methods, permissions and WhoAmI response are not modified.

Authenticated browser acceptance on master confirmed:

- Header shows `weihao li`; `Anonymous` and danger alerts are absent.
- `whoami` returns HTTP 200.
- `夜/昼` theme switching works; the prior dark preference was restored after the check.
- Read-only navigation loaded Manage realms, Clients, Realm roles, Users, Groups, Sessions and Events without errors.
- Users displayed `i@weihaostudio.com`; no write action was performed.
- Restart-scoped logs contain no new `TemplateNotFoundException`, `FreeMarkerException`, `ERROR`, or `FATAL` entry.
- Final deployed KC26 JAR SHA-256: `18ea2eb8071e5a75da2c90aad8de7bd81fe575cc0d7726a5df751221899e59ef`.

Intermediate rollback notes:

- `/home/weihao/docker/keycloak-theme-backups/20260712-123953-admin-masthead-identity/` is valid but still displays `Anonymous`.
- `/home/weihao/docker/keycloak-theme-backups/20260712-124546-admin-masthead-token-claims/` is valid but its Admin UI hits a getter-only property error; use only for forensic comparison, not normal rollback.
- `20260712-123855-admin-masthead-identity-incomplete` and `20260712-123933-admin-masthead-identity-incomplete` have incomplete Realm snapshots and must not be used.
