import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(`${process.cwd()}/src/admin/index.css`, "utf8");

describe("AuthInk Admin visual contract", () => {
    it("keeps the published subdued Admin backdrop while removing the page-section glass card", () => {
        expect(css).toContain("body::before");
        expect(css).toContain("--authink-admin-wallpaper");
        expect(css).toMatch(/\.authink-admin\s*\{[^}]*background:\s*var\(--authink-admin-canvas\)/s);
        expect(css).toMatch(/\.authink-admin \.pf-v5-c-page__main-section\s*\{[^}]*margin:\s*0/s);
        expect(css).toMatch(/\.authink-admin \.pf-v5-c-page__main-section\s*\{[^}]*backdrop-filter:\s*none/s);
        expect(css).toMatch(/\.pf-v5-c-card/);
        expect(css).toMatch(/backdrop-filter:\s*blur/);
    });

    it("uses the approved 44px theme control at the 20px top-right inset", () => {
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*width:\s*44px/s);
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*height:\s*44px/s);
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*inset-block-start:\s*20px/s);
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*inset-inline-end:\s*20px/s);
    });

    it("maps desktop navigation and uses horizontally scrollable navigation on narrow shells", () => {
        expect(css).toMatch(/\.pf-v5-c-page__sidebar[^}]*width:\s*256px/s);
        expect(css).toMatch(/\.pf-v5-c-nav__link[^}]*border-radius/s);
        expect(css).toMatch(/@media \(max-width:\s*1024px\)[\s\S]*?\.pf-v5-c-nav__list[^}]*grid-auto-flow:\s*column/s);
        expect(css).toMatch(/\.pf-v5-c-nav__list[^}]*overflow-x:\s*auto/s);
        expect(css).toMatch(/\.pf-v5-c-nav__section-title[^}]*display:\s*none/s);
        expect(css).toMatch(/@media \(max-width:\s*768px\)/);
    });
});
