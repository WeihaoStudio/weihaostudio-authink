import type { Keycloak, KeycloakTokenParsed } from "oidc-spa/keycloak-js";

function hasMastheadIdentity(token?: KeycloakTokenParsed): boolean {
    return Boolean(
        token?.given_name || token?.family_name || token?.preferred_username
    );
}

/**
 * The shared Admin UI masthead only recognizes the legacy OIDC claims
 * `given_name`, `family_name` and `preferred_username`. KC26 can provide an ID
 * token with only `name`/`username`, while WhoAmI still has the display name.
 * Adapt that value for masthead rendering without mutating the live client.
 */
export function withWhoAmIDisplayName(
    keycloak: Keycloak,
    displayName?: string
): Keycloak {
    const username = displayName?.trim();

    if (!username || hasMastheadIdentity(keycloak.idTokenParsed)) {
        return keycloak;
    }

    const adaptedKeycloak = Object.create(keycloak) as Keycloak;

    Object.defineProperty(adaptedKeycloak, "idTokenParsed", {
        value: {
            ...keycloak.idTokenParsed,
            preferred_username: username
        },
        enumerable: true,
        configurable: true
    });

    return adaptedKeycloak;
}
