import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const fetchContentSource = readFileSync(
    join(process.cwd(), "src/account/content/fetchContent.ts"),
    "utf8"
);

describe("Account fetchContent", () => {
    it("keeps Account menu content statically imported to avoid stale dynamic content chunks", () => {
        expect(fetchContentSource).toContain(
            'import { content } from "../assets/content"'
        );
        expect(fetchContentSource).not.toMatch(
            /await\s+import\(["']\.\.\/assets\/content["']\)/
        );
    });
});
