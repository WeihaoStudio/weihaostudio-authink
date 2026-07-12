# ADR 0001: Use Keycloakify Single-Page Account Theme

- Status: Accepted for KC26-first implementation
- Date: 2026-07-12

## Context

AuthInk must cover profile, password, TOTP, sessions, linked identities, trusted devices and recovery surfaces while retaining Keycloak behavior on Keycloak 26 and, after a separate gate, Keycloak 21. Keycloakify 11 offers Multi-Page (Account v1 fork) and Single-Page (Account v3) implementations.

## Decision

Use the Keycloakify **Single-Page Account Theme** and initially customize only its supported loader-level inputs and PatternFly variables. Do not eject or fork routes/components unless a verified design requirement cannot be met otherwise.

## Rationale

- Single-Page is Keycloak's current Account UI model and retains the latest account-management features.
- Keycloakify documents its compatibility layer as supporting Keycloak versions down to 19, covering KC21 and KC26 in principle.
- Multi-Page has Storybook and simpler CSS customization, but does not provide all current Account Console features without additional Account REST API work.
- Loader-level logo/content/CSS customization has a smaller upgrade surface than owning Keycloak Account UI components.

## Consequences and gates

- The generated Account SPA adds PatternFly, router and i18n dependencies and has no Storybook integration.
- KC26 is the first runtime gate. KC21 remains on `keycloak.v2` until the same artifact is tested separately.
- If KC21 fails, package/version targeting must split or KC21 must retain its native Account Theme; production compatibility is not inferred from KC26.
- Theme selection and JAR backup must be independently reversible.
