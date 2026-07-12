import { describe, expect, it } from "vitest";
import { authInkAssets } from "../login/assets";
import { getAdminBrandLogoUrl } from "./adminThemeBranding";

describe("AuthInk Admin brand logo", () => {
    it("uses the ink logo on light surfaces and white logo on dark surfaces", () => {
        expect(getAdminBrandLogoUrl({ theme: "light", customLogo: undefined })).toBe(authInkAssets.logoInkUrl);
        expect(getAdminBrandLogoUrl({ theme: "dark", customLogo: undefined })).toBe(authInkAssets.logoWhiteUrl);
    });

    it("keeps the realm preview logo authoritative", () => {
        expect(getAdminBrandLogoUrl({ theme: "dark", customLogo: "https://example.test/realm-logo.svg" })).toBe("https://example.test/realm-logo.svg");
    });
});
