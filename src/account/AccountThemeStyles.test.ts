import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(`${process.cwd()}/src/account/authink-account.css`, "utf8");

describe("AuthInk Account visual contract", () => {
    it("uses the OpenDesign canvas hierarchy without a wallpaper or a page-section glass card", () => {
        expect(css).not.toContain(".authink-account::before");
        expect(css).toMatch(/\.authink-account\s*\{[^}]*background:\s*var\(--authink-account-canvas\)/s);
        expect(css).toMatch(/\.authink-account \.pf-v5-c-page__main-section\s*\{[^}]*margin:\s*0/s);
        expect(css).toMatch(/\.authink-account \.pf-v5-c-page__main-section\s*\{[^}]*backdrop-filter:\s*none/s);
        expect(css).toMatch(/\.pf-v5-c-card/);
        expect(css).toMatch(/backdrop-filter:\s*blur/);
    });

    it("preserves the 44px navigation target and maps the narrow shell to scrollable horizontal navigation", () => {
        expect(css).toMatch(/\.pf-v5-c-nav__link[^}]*min-height:\s*44px/s);
        expect(css).toMatch(/@media \(max-width:\s*1024px\)[\s\S]*?\.pf-v5-c-nav__list[^}]*grid-auto-flow:\s*column/s);
        expect(css).toMatch(/\.pf-v5-c-nav__list[^}]*overflow-x:\s*auto/s);
        expect(css).toMatch(/\.pf-v5-c-nav__section-title[^}]*display:\s*none/s);
        expect(css).toMatch(/\.authink-account-theme-toggle\s*\{[^}]*width:\s*44px/s);
    });
});
