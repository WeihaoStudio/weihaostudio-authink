import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { KcContext } from "./kc.gen";
import { getKcPageFallback } from "./KcPageFallback";

describe("getKcPageFallback", () => {
    it("provides the visible AuthInk loading state before the lazy login chunk resolves", () => {
        render(getKcPageFallback({ themeType: "login" } as KcContext));

        expect(screen.getByRole("status", { name: "页面加载中" })).toBeVisible();
    });

    it("does not introduce a Login fallback for non-login surfaces", () => {
        expect(getKcPageFallback({ themeType: "account" } as KcContext)).toBeUndefined();
        expect(getKcPageFallback({ themeType: "admin" } as KcContext)).toBeUndefined();
    });
});
