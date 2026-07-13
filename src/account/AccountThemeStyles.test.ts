import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(`${process.cwd()}/src/account/authink-account.css`, "utf8");

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractRule(selector: string) {
    const selectorPattern = escapeRegExp(selector).replace(/\s+/g, "\\s+");
    const match = css.match(new RegExp(`(?:^|})\\s*${selectorPattern}\\s*\\{([^}]*)}`, "s"));

    expect(match, `Expected CSS rule for selector: ${selector}`).not.toBeNull();
    return match?.[1] ?? "";
}

describe("AuthInk Account visual contract", () => {
    it("uses solid Account surfaces without wallpaper or backdrop filtering", () => {
        expect(css).not.toContain(".authink-account::before");
        expect(css).not.toMatch(/(?:^|[;{])\s*(?:-webkit-)?backdrop-filter\s*:/m);

        expect(extractRule(".authink-account")).toMatch(/(?:^|;)\s*background:\s*var\(--color-canvas\)\s*(?:;|$)/);
        expect(extractRule(".authink-account .pf-v5-c-page__sidebar")).toMatch(/(?:^|;)\s*background:\s*var\(--color-surface\)\s*(?:;|$)/);
        expect(extractRule(".authink-account .pf-v5-c-masthead")).toMatch(/(?:^|;)\s*background:\s*var\(--color-surface\)\s*(?:;|$)/);
        expect(extractRule(".authink-account .pf-v5-c-card, .authink-account .pf-v5-c-modal-box")).toMatch(/(?:^|;)\s*background:\s*var\(--color-surface\)\s*(?:;|$)/);
        expect(extractRule(".authink-account .pf-v5-c-table")).toMatch(/(?:^|;)\s*background:\s*var\(--color-surface\)\s*(?:;|$)/);
        expect(extractRule(".authink-account-theme-toggle")).toMatch(/(?:^|;)\s*background:\s*var\(--color-surface\)\s*(?:;|$)/);
    });

    it("defines the Account content track and section rhythm", () => {
        expect(extractRule(".authink-account .pf-v5-c-page__main-container")).toMatch(
            /(?:^|;)\s*padding:\s*clamp\(72px,\s*9vw,\s*128px\)\s+clamp\(24px,\s*7vw,\s*112px\)\s+64px\s*(?:;|$)/,
        );
        expect(extractRule(".authink-account .pf-v5-c-page__main-section")).toMatch(
            /(?:^|;)\s*max-width:\s*1080px\s*(?:;|$)/,
        );
        expect(extractRule(".authink-account .pf-v5-c-page__main-section + .pf-v5-c-page__main-section")).toMatch(
            /(?:^|;)\s*margin-top:\s*44px\s*(?:;|$)/,
        );
    });

    it("does not move the Account theme toggle on hover", () => {
        const hoverRule = extractRule(".authink-account-theme-toggle:hover");

        expect(hoverRule).not.toMatch(/(?:^|;)\s*transform\s*:/);
    });

    it("preserves the 44px navigation target and maps the narrow shell to scrollable horizontal navigation", () => {
        expect(css).toMatch(/\.pf-v5-c-nav__link[^}]*min-height:\s*var\(--control-height\)/s);
        expect(css).toMatch(/@media \(max-width:\s*1024px\)[\s\S]*?\.pf-v5-c-nav__list[^}]*grid-auto-flow:\s*column/s);
        expect(css).toMatch(/\.pf-v5-c-nav__list[^}]*overflow-x:\s*auto/s);
        expect(css).toMatch(/\.pf-v5-c-nav__section-title[^}]*display:\s*none/s);
        expect(css).toMatch(/\.authink-account-theme-toggle\s*\{[^}]*width:\s*44px/s);
    });

    it("uses canonical OpenDesign tokens for borders, shadows, and radius", () => {
        expect(css).toContain("var(--color-border-subtle)");
        expect(css).toContain("var(--color-surface)");
        expect(css).toContain("var(--shadow-card)");
        expect(css).toContain("var(--radius-lg)");
        expect(css).toContain("var(--color-text-secondary)");
    });
});
