# KC26 Login flows and Account Theme deployment evidence

Date: 2026-07-12
Target: `192.168.200.10` / `keycloak-test-server-1` / Keycloak 26.0.0
Realm: `WeihaoStudio`

## Artifact

- JAR: `dist_keycloak/versioned/weihaostudio-authink-keycloak-26.0.0.jar`
- SHA-256 after Account Theme: `c7d4802e66608333bf4287207ba8c534a242b2c94270994bd81c2680a5b660dc`
- Account entries in JAR: 192

## Automated gates

- Vitest: 10 files, 28 tests passed.
- TypeScript/Vite/Keycloakify build: passed.
- KC26 startup: Keycloak 26.0.0 started without theme/provider ERROR or FATAL log entries.
- Remote provider SHA-256 equals local artifact SHA-256.
- Realm state after deployment: login=`weihaostudio-authink`, account=`weihaostudio-authink`, admin/email unchanged.
- Headless Chromium confirmed the public login flow still renders the AuthInk shell after deployment (`/tmp/authink-kc26-login-flow.png`).

## Rollback

Account deployment backup:

`/home/weihao/docker/keycloak-theme-backups/20260712-185509-account/`

Rollback requires both:

1. Restore the backed-up JAR to `/opt/keycloak/providers/weihaostudio-authink-keycloak-26.0.0.jar` in `keycloak-test-server-1`.
2. Restore the `account_theme` value recorded in `realm-theme-before.txt`, then restart `keycloak-test-server-1`.

## Remaining manual gate

An authenticated Account Console walkthrough and real required-action flows are still required. Automated creation of an ephemeral test user was intentionally stopped because the container's bootstrap admin environment credential is stale (`invalid_grant`). No database credential or administrator account was reset or bypassed. KC21 remains unchanged.
