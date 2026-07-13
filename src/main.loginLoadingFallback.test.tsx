import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { KcContext } from "./kc.gen";

const rootRender = vi.fn();

vi.mock("react-dom/client", () => ({
    createRoot: vi.fn(() => ({ render: rootRender }))
}));

describe("main Login loading fallback wiring", () => {
    beforeEach(() => {
        vi.resetModules();
        rootRender.mockReset();
        window.kcContext = { themeType: "login" } as KcContext;
    });

    afterEach(() => {
        delete window.kcContext;
    });

    it("passes the AuthInk loading view into the outer lazy KcPage boundary", async () => {
        await import("./main");

        const rootElement = rootRender.mock.calls[0]?.[0];
        const kcPageElement = rootElement.props.children;
        render(kcPageElement.props.fallback);

        expect(screen.getByRole("status", { name: "页面加载中" })).toBeVisible();
    });
});
