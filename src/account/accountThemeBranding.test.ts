import { describe, expect, it } from "vitest";
import { authInkAssets } from "../login/assets";
import { getAccountBrandLogoUrl } from "./accountThemeBranding";

describe("AuthInk Account brand logo", () => {
    it("uses ink on light Account shell and white on dark Account shell", () => {
        expect(getAccountBrandLogoUrl("light")).toBe(authInkAssets.logoInkUrl);
        expect(getAccountBrandLogoUrl("dark")).toBe(authInkAssets.logoWhiteUrl);
    });
});
