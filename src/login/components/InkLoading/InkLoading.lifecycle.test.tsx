import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const context = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn()
};

function installCanvas() {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => context as unknown as CanvasRenderingContext2D);
}

function installImage(outcomes: Array<"load" | "error"> = ["load"]) {
    const requestedUrls: string[] = [];
    let index = 0;

    class MockImage {
        decoding = "auto";
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(value: string) {
            requestedUrls.push(value);
            const outcome = outcomes[index++] ?? outcomes.at(-1) ?? "error";
            queueMicrotask(() => outcome === "load" ? this.onload?.() : this.onerror?.());
        }
    }
    vi.stubGlobal("Image", MockImage);
    return requestedUrls;
}

describe("InkLoading lifecycle", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
        context.clearRect.mockClear();
        context.drawImage.mockClear();
        context.getImageData.mockClear();
        context.createImageData.mockClear();
        context.putImageData.mockClear();
        installCanvas();
        installImage();
    });

    afterEach(() => vi.unstubAllGlobals());

    it("cancels the scheduled animation frame when unmounted", async () => {
        const requestFrame = vi.spyOn(window, "requestAnimationFrame").mockReturnValue(42);
        const cancelFrame = vi.spyOn(window, "cancelAnimationFrame");
        const { InkLoading } = await import("./InkLoading");
        const { unmount } = render(<InkLoading />);
        await waitFor(() => expect(requestFrame).toHaveBeenCalled());
        unmount();
        expect(cancelFrame).toHaveBeenCalledWith(42);
    });

    it("renders one complete static frame for reduced motion", async () => {
        vi.stubGlobal("matchMedia", vi.fn(() => ({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        })));
        vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
            callback(1);
            return 7;
        });
        const { InkLoading } = await import("./InkLoading");
        render(<InkLoading />);
        await waitFor(() => expect(context.putImageData).toHaveBeenCalledTimes(1));
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    });

    it("retries PNG after WebP fails and uses the PNG to draw the animation", async () => {
        const requestedUrls = installImage(["error", "load"]);
        const { InkLoading } = await import("./InkLoading");
        render(<InkLoading />);

        await waitFor(() => expect(context.drawImage).toHaveBeenCalled());
        expect(requestedUrls).toHaveLength(2);
        expect(requestedUrls[0]).toContain("ink-ring.webp");
        expect(requestedUrls[1]).toContain("ink-ring.png");
    });

    it("falls back to static PNG and retries both assets after a terminal failure", async () => {
        const requestedUrls = installImage(["error", "error", "error", "error"]);
        vi.spyOn(console, "warn").mockImplementation(() => undefined);
        const { InkLoading } = await import("./InkLoading");
        const first = render(<InkLoading />);

        await waitFor(() => expect(first.container.querySelector("img.ink-loading__fallback")).toBeInTheDocument());
        expect(first.container.querySelector("img.ink-loading__fallback")).toHaveAttribute(
            "src",
            expect.stringContaining("ink-ring.png")
        );
        expect(requestedUrls).toHaveLength(2);
        first.unmount();

        const second = render(<InkLoading />);
        await waitFor(() => expect(second.container.querySelector("img.ink-loading__fallback")).toBeInTheDocument());
        expect(requestedUrls).toHaveLength(4);
        expect(requestedUrls).toEqual([
            expect.stringContaining("ink-ring.webp"),
            expect.stringContaining("ink-ring.png"),
            expect.stringContaining("ink-ring.webp"),
            expect.stringContaining("ink-ring.png")
        ]);
    });
});
