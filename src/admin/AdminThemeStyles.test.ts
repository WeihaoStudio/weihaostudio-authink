import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(`${process.cwd()}/src/admin/index.css`, "utf8");

describe("AuthInk Admin visual contract", () => {
    it("uses a clean solid canvas without wallpaper or glass effects", () => {
        expect(css).not.toContain("body::before");
        expect(css).not.toContain("--authink-admin-wallpaper");
        expect(css).not.toContain("backdrop-filter: blur");
        expect(css).toMatch(/\.authink-admin\s*\{[^}]*background:\s*var\(--color-canvas\)/s);
    });

    it("keeps main section as clean workspace (no card treatment)", () => {
        expect(css).toMatch(/\.authink-admin \.pf-v5-c-page__main-section\s*\{[^}]*margin:\s*0/s);
        expect(css).toMatch(/\.authink-admin \.pf-v5-c-page__main-section\s*\{[^}]*backdrop-filter:\s*none/s);
    });

    it("uses solid surfaces for masthead and sidebar", () => {
        expect(css).toMatch(/\.pf-v5-c-masthead\s*\{[^}]*background:\s*var\(--color-surface\)/s);
        expect(css).toMatch(/\.pf-v5-c-page__sidebar\s*\{[^}]*background:\s*var\(--color-surface\)/s);
    });

    it("uses the approved 44px theme control", () => {
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*width:\s*44px/s);
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*height:\s*44px/s);
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*top:\s*var\(--space-5\)/s);
        expect(css).toMatch(/\.authink-admin-theme-toggle\s*\{[^}]*right:\s*var\(--space-5\)/s);
    });

    it("maps desktop navigation and uses scrollable navigation on narrow shells", () => {
        expect(css).toMatch(/\.pf-v5-c-page__sidebar[^}]*width:\s*256px/s);
        expect(css).toMatch(/\.pf-v5-c-nav__link[^}]*border-radius/s);
        expect(css).toMatch(/@media \(max-width:\s*1024px\)[\s\S]*?\.pf-v5-c-nav__list/s);
        expect(css).toMatch(/\.pf-v5-c-nav__list[^}]*overflow-x:\s*auto/s);
        expect(css).toMatch(/\.pf-v5-c-nav__section-title[^}]*display:\s*none/s);
        expect(css).toMatch(/@media \(max-width:\s*768px\)/);
    });

    it("uses canonical OpenDesign tokens", () => {
        expect(css).toContain("var(--color-border-subtle)");
        expect(css).toContain("var(--color-surface)");
        expect(css).toContain("var(--shadow-card)");
        expect(css).toContain("var(--radius-lg)");
        expect(css).toContain("var(--color-text-secondary)");
    });
});
