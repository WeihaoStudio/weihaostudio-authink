import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { InkLoading } from "./InkLoading";
import { getInkDryAlpha, getInkFrameState, INK_LOADING_TIMING } from "./inkLoadingCore";

describe("InkLoading", () => {
    it("exposes an accessible status by default", () => {
        render(<InkLoading paused />);
        const status = screen.getByRole("status", { name: "加载中" });
        expect(status).toHaveAttribute("aria-live", "polite");
        expect(status.querySelector("img")).toHaveAttribute("aria-hidden", "true");
    });

    it("can be decorative and supports CSS sizes", () => {
        const { container } = render(<InkLoading paused announce={false} size="2rem" />);
        const loading = container.querySelector(".ink-loading");
        expect(loading).not.toHaveAttribute("role");
        expect(loading).toHaveStyle("--ink-loading-size: 2rem");
    });


    it("does not schedule animation frames while paused", () => {
        const requestFrame = vi.spyOn(window, "requestAnimationFrame");
        render(<InkLoading paused />);
        expect(requestFrame).not.toHaveBeenCalled();
        requestFrame.mockRestore();
    });

    it("rebuilds its CSS size when the size prop changes", () => {
        const { container, rerender } = render(<InkLoading paused size={24} />);
        expect(container.querySelector(".ink-loading")).toHaveStyle("--ink-loading-size: 24px");
        rerender(<InkLoading paused size={64} />);
        expect(container.querySelector(".ink-loading")).toHaveStyle("--ink-loading-size: 64px");
    });

    it("is SSR safe", () => {
        expect(() => renderToString(<InkLoading />)).not.toThrow();
    });

    it("keeps the approved draw, hold, directional dry and pause timeline", () => {
        expect(getInkFrameState(0)).toMatchObject({ phase: "draw", reveal: 0, alpha: 1 });
        expect(getInkFrameState(INK_LOADING_TIMING.drawMs)).toEqual({ phase: "hold", reveal: 1, dryProgress: 0, alpha: 1 });
        expect(INK_LOADING_TIMING.dryMs).toBe(2400);
        expect(getInkFrameState(INK_LOADING_TIMING.drawMs + INK_LOADING_TIMING.holdMs)).toEqual({ phase: "dry", reveal: 1, dryProgress: 0 });
        expect(getInkFrameState(INK_LOADING_TIMING.drawMs + INK_LOADING_TIMING.holdMs + INK_LOADING_TIMING.dryMs)).toEqual({ phase: "pause", reveal: 0, dryProgress: 1 });
    });

    it("dries pixels clockwise with a soft fading trail", () => {
        expect(getInkDryAlpha(0, 0)).toBe(1);
        expect(getInkDryAlpha(0.05, 0.5)).toBeLessThan(getInkDryAlpha(0.75, 0.5));
        expect(getInkDryAlpha(0.75, 0.5)).toBe(1);
        expect(getInkDryAlpha(0, 1)).toBe(0);
        expect(getInkDryAlpha(1, 1)).toBe(0);
    });
});
