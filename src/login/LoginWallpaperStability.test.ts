import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(`${process.cwd()}/src/login/authink.css`, "utf8");

describe("AuthInk production login wallpaper", () => {
    it("keeps the approved light 4K wallpaper when the form theme changes", () => {
        expect(css).toMatch(
            /\.auth-browser--production \.auth-shell\s*\{[^}]*background:\s*var\(--auth-light-background\)\s+center center\s*\/\s*cover\s+no-repeat/s
        );
        expect(css).not.toMatch(
            /\.auth-browser--production\[data-theme="dark"\] \.auth-shell\s*\{[^}]*--auth-dark-background/s
        );
    });
});
