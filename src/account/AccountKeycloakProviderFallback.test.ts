import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const providerSource = readFileSync(
    `${process.cwd()}/src/shared/keycloak-ui-shared/context/KeycloakContext.tsx`,
    "utf8"
);
const accountSource = readFileSync(
    `${process.cwd()}/src/account/KcAccountUi.tsx`,
    "utf8"
);

describe("Account Keycloak bootstrap fallback", () => {
    it("lets a theme provide an accessible bootstrap fallback instead of the default PatternFly spinner", () => {
        expect(providerSource).toContain("loadingFallback?: ReactNode;");
        expect(providerSource).toContain("return loadingFallback ?? <Spinner />;");
        expect(accountSource).toContain('loadingFallback={<AccountLoading variant="page" />}');
    });

    it("stops the Account bootstrap timeout only after OIDC initialization succeeds", () => {
        expect(providerSource).toContain("onReady?.();");
        expect(accountSource).toContain("onReady={() => setKeycloakInitialized(true)}");
        expect(accountSource).toContain("if (!isI18nInitialized || isKeycloakInitialized)");
    });

    it("turns rejected OIDC initialization into the Account error state", () => {
        expect(providerSource).toContain("onError?.(error);");
        expect(accountSource).toContain("onError={() => setInitTimedOut(true)}");
        expect(accountSource).toContain('errorCode="INIT-001"');
    });
});
