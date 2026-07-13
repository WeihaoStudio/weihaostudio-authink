import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface CssRule {
    selectors: string[];
    body: string;
}

const css = readFileSync(`${process.cwd()}/src/account/authink-account.css`, "utf8");

function normalizeSelector(selector: string) {
    return selector.replace(/\s+/g, " ").trim();
}

function findBlockEnd(source: string, openingBrace: number) {
    let depth = 1;
    let quote: string | undefined;

    for (let index = openingBrace + 1; index < source.length; index += 1) {
        const character = source[index];

        if (quote) {
            if (character === "\\") {
                index += 1;
            } else if (character === quote) {
                quote = undefined;
            }
            continue;
        }

        if (character === '"' || character === "'") {
            quote = character;
        } else if (character === "{") {
            depth += 1;
        } else if (character === "}") {
            depth -= 1;
            if (depth === 0) return index;
        }
    }

    return source.length;
}

function splitSelectors(selectorList: string) {
    const selectors: string[] = [];
    let start = 0;
    let groupingDepth = 0;
    let quote: string | undefined;

    for (let index = 0; index < selectorList.length; index += 1) {
        const character = selectorList[index];

        if (quote) {
            if (character === "\\") {
                index += 1;
            } else if (character === quote) {
                quote = undefined;
            }
            continue;
        }

        if (character === '"' || character === "'") {
            quote = character;
        } else if (character === "(" || character === "[") {
            groupingDepth += 1;
        } else if (character === ")" || character === "]") {
            groupingDepth -= 1;
        } else if (character === "," && groupingDepth === 0) {
            selectors.push(normalizeSelector(selectorList.slice(start, index)));
            start = index + 1;
        }
    }

    selectors.push(normalizeSelector(selectorList.slice(start)));
    return selectors.filter(Boolean);
}

function scanTopLevelRules(source: string): CssRule[] {
    const uncommentedSource = source.replace(/\/\*[\s\S]*?\*\//g, "");
    const rules: CssRule[] = [];
    let index = 0;

    while (index < uncommentedSource.length) {
        while (/\s/.test(uncommentedSource[index] ?? "")) index += 1;
        if (index >= uncommentedSource.length) break;

        const preludeStart = index;
        let quote: string | undefined;

        while (index < uncommentedSource.length) {
            const character = uncommentedSource[index];

            if (quote) {
                if (character === "\\") {
                    index += 2;
                    continue;
                }
                if (character === quote) quote = undefined;
            } else if (character === '"' || character === "'") {
                quote = character;
            } else if (character === "{" || character === ";") {
                break;
            }

            index += 1;
        }

        if (uncommentedSource[index] === ";") {
            index += 1;
            continue;
        }
        if (uncommentedSource[index] !== "{") break;

        const prelude = uncommentedSource.slice(preludeStart, index).trim();
        const closingBrace = findBlockEnd(uncommentedSource, index);

        if (!prelude.startsWith("@")) {
            rules.push({
                selectors: splitSelectors(prelude),
                body: uncommentedSource.slice(index + 1, closingBrace)
            });
        }

        index = closingBrace + 1;
    }

    return rules;
}

function findTopLevelRule(source: string, ...requiredSelectors: string[]) {
    const normalizedRequiredSelectors = requiredSelectors.map(normalizeSelector);
    const rule = scanTopLevelRules(source).find(candidate =>
        normalizedRequiredSelectors.every(selector =>
            candidate.selectors.includes(selector)
        )
    );

    expect(
        rule,
        `Expected top-level CSS rule containing: ${requiredSelectors.join(", ")}`
    ).toBeDefined();
    return rule?.body ?? "";
}

describe("top-level CSS rule scanner", () => {
    it("collects only ordinary top-level rules outside media and supports blocks", () => {
        const fixture = `
            /* preceding comment */
            .surface-b,
            .surface-a {
                color: base;
            }

            @media (max-width: 640px) {
                .surface-a,
                .media-only {
                    color: media-override;
                }
            }

            @supports (backdrop-filter: blur(1px)) {
                .supports-only,
                .surface-a {
                    color: supports-override;
                }
            }
        `;

        const rules = scanTopLevelRules(fixture);
        const topLevelSelectors = rules.flatMap(rule => rule.selectors);
        const topLevelBodies = rules.map(rule => rule.body).join("\n");

        expect(rules).toHaveLength(1);
        expect(rules.map(rule => rule.selectors)).toEqual([[".surface-b", ".surface-a"]]);
        expect(topLevelBodies).toContain("color: base");
        expect(topLevelSelectors).not.toContain(".media-only");
        expect(topLevelSelectors).not.toContain(".supports-only");
        expect(topLevelBodies).not.toContain("media-override");
        expect(topLevelBodies).not.toContain("supports-override");
    });
});

describe("AuthInk Account visual contract", () => {
    it("does not render an Account wallpaper", () => {
        expect(css).not.toContain(".authink-account::before");
    });

    it("does not declare backdrop filtering", () => {
        const declarations = [
            ...css
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .matchAll(/(?:^|[;{])\s*((?:-webkit-)?backdrop-filter\s*:[^;}]+)/gm)
        ].map(match => match[1].trim());

        expect(declarations).toEqual([]);
    });

    it("uses the canvas token for the Account shell", () => {
        expect(findTopLevelRule(css, ".authink-account")).toMatch(
            /(?:^|;)\s*background:\s*var\(--color-canvas\)\s*(?:;|$)/
        );
    });

    it.each([
        ["Sidebar", [".authink-account .pf-v5-c-page__sidebar"]],
        ["Masthead", [".authink-account .pf-v5-c-masthead"]],
        ["Card", [".authink-account .pf-v5-c-card"]],
        ["Modal", [".authink-account .pf-v5-c-modal-box"]],
        ["Table", [".authink-account .pf-v5-c-table"]],
        ["Account theme toggle", [".authink-account-theme-toggle"]]
    ])("uses the surface token for %s", (_name, selectors) => {
        expect(findTopLevelRule(css, ...selectors)).toMatch(
            /(?:^|;)\s*background:\s*var\(--color-surface\)\s*(?:;|$)/
        );
    });

    it("defines the Account content track on the real PatternFly main", () => {
        const mainRule = findTopLevelRule(
            css,
            ".authink-account .pf-v5-c-page__main"
        );

        expect(mainRule).toMatch(/(?:^|;)\s*min-height:\s*0\s*(?:;|$)/);
        expect(mainRule).toMatch(
            /(?:^|;)\s*padding:\s*clamp\(72px,\s*9vw,\s*128px\)\s+clamp\(24px,\s*7vw,\s*112px\)\s+64px\s*(?:;|$)/
        );
        expect(mainRule).toMatch(
            /(?:^|;)\s*background:\s*var\(--color-canvas\)\s*(?:;|$)/
        );
        expect(css).not.toContain(".pf-v5-c-page__main-container");
    });

    it("defines the MainSection margin and width constraints", () => {
        const mainSectionRule = findTopLevelRule(
            css,
            ".authink-account .pf-v5-c-page__main-section"
        );

        expect(mainSectionRule).toMatch(/(?:^|;)\s*margin:\s*0\s*(?:;|$)/);
        expect(mainSectionRule).toMatch(/(?:^|;)\s*width:\s*100%\s*(?:;|$)/);
        expect(mainSectionRule).toMatch(/(?:^|;)\s*max-width:\s*1080px\s*(?:;|$)/);
    });

    it("defines spacing between adjacent MainSections", () => {
        expect(
            findTopLevelRule(
                css,
                ".authink-account .pf-v5-c-page__main-section + .pf-v5-c-page__main-section"
            )
        ).toMatch(/(?:^|;)\s*margin-top:\s*44px\s*(?:;|$)/);
    });

    it("does not move the Account theme toggle on hover", () => {
        const hoverRule = findTopLevelRule(css, ".authink-account-theme-toggle:hover");

        expect(hoverRule).not.toMatch(/(?:^|;)\s*transform\s*:/);
    });

    it("preserves the 44px navigation target and maps the narrow shell to scrollable horizontal navigation", () => {
        expect(css).toMatch(
            /\.pf-v5-c-nav__link[^}]*min-height:\s*var\(--control-height\)/s
        );
        expect(css).toMatch(
            /@media \(max-width:\s*1024px\)[\s\S]*?\.pf-v5-c-nav__list[^}]*grid-auto-flow:\s*column/s
        );
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
