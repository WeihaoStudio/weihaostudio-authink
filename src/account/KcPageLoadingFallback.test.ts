import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(`${process.cwd()}/src/account/KcPage.tsx`, "utf8");

describe("Account KcPage loading fallback", () => {
    it("uses the AuthInk Account loading component for the outer Account UI loader", () => {
        expect(source).toContain('import { AccountLoading } from "./AccountLoading";');
        expect(source).toMatch(/loadingFallback=\{<AccountLoading\s+variant="page"\s*\/?>\}/);
    });

    it("does not rely on the Keycloakify default PatternFly spinner fallback", () => {
        expect(source).not.toContain("<KcAccountUiLoader kcContext={kcContext} KcAccountUi={KcAccountUi} />");
    });
});
