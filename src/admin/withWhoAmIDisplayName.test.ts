import { describe, expect, it, vi } from "vitest";
import { withWhoAmIDisplayName } from "./withWhoAmIDisplayName";

describe("withWhoAmIDisplayName", () => {
    it("injects WhoAmI displayName for masthead rendering without changing methods", () => {
        const logout = vi.fn();
        const keycloak = { logout, idTokenParsed: undefined };

        const adapted = withWhoAmIDisplayName(keycloak as never, "weihao li");

        expect(adapted.idTokenParsed?.preferred_username).toBe("weihao li");
        expect(adapted.logout).toBe(logout);
        expect(keycloak.idTokenParsed).toBeUndefined();
    });

    it("adds a supported masthead claim when the token only has name and username", () => {
        const keycloak = {
            idTokenParsed: {
                name: "weihao li",
                username: "i@weihaostudio.com",
                email: "i@weihaostudio.com"
            }
        };

        const adapted = withWhoAmIDisplayName(keycloak as never, "weihao li");

        expect(adapted).not.toBe(keycloak);
        expect(adapted.idTokenParsed).toMatchObject({
            name: "weihao li",
            username: "i@weihaostudio.com",
            email: "i@weihaostudio.com",
            preferred_username: "weihao li"
        });
        expect(keycloak.idTokenParsed).not.toHaveProperty("preferred_username");
    });

    it("supports oidc-spa clients whose idTokenParsed is getter-only", () => {
        const logout = vi.fn();
        const keycloak = Object.create(
            Object.defineProperty({}, "idTokenParsed", {
                get: () => ({ name: "weihao li", username: "i@weihaostudio.com" })
            })
        );
        keycloak.logout = logout;

        const adapted = withWhoAmIDisplayName(keycloak as never, "weihao li");

        expect(adapted.idTokenParsed?.preferred_username).toBe("weihao li");
        expect(adapted.logout).toBe(logout);
    });

    it("preserves an existing id token identity", () => {
        const keycloak = {
            idTokenParsed: { preferred_username: "token-user" }
        };

        expect(withWhoAmIDisplayName(keycloak as never, "weihao li")).toBe(
            keycloak
        );
    });
});
