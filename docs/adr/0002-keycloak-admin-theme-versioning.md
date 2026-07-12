# ADR 0002: Gate the custom Admin UI to KC26 runtime only

- Status: Accepted
- Date: 2026-07-12

## Context

The generated Keycloakify Admin UI is sourced from `@keycloakify/keycloak-admin-ui` 260601.0.1 and mirrors the modern Keycloak Admin Console. The Homelab has Keycloak 26.0.0 in the isolated test environment and Keycloak 21.0.2 in production. Admin Console API, routes, PatternFly components and feature flags differ materially between these versions.

## Decision

Build the Admin Theme into the shared source artifact, but enable and validate it only on the KC26 test realm. Keep KC21 production on `keycloak.v2` until a separate compatibility test proves the exact KC21 artifact and all critical administration flows.

Customize only the Admin SPA root, color scheme, brand and global presentation tokens. Do not fork user, realm, client, group, role, session or event business screens.

## Consequences

- KC26 can use `weihaostudio-authink` as `admin_theme` after isolated verification.
- KC21 remains a native fallback and is not changed by this phase.
- A later KC21-compatible Admin artifact may require a separate package/version target; compatibility will not be inferred from successful KC26 startup.
- Rollback requires restoring both the provider JAR and the realm `admin_theme` value.
