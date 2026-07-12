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

function installImage(mode: "load" | "error" = "load") {
    class MockImage {
        decoding = "auto";
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(_value: string) {
            queueMicrotask(() => mode === "load" ? this.onload?.() : this.onerror?.());
        }
    }
    vi.stubGlobal("Image", MockImage);
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

    it("falls back to the static WebP when the image cannot load", async () => {
        installImage("error");
        vi.spyOn(console, "warn").mockImplementation(() => undefined);
        const { InkLoading } = await import("./InkLoading");
        const { container } = render(<InkLoading />);
        await waitFor(() => expect(container.querySelector("img.ink-loading__fallback")).toBeInTheDocument());
        expect(container.querySelector("canvas")).not.toBeInTheDocument();
    });
});
