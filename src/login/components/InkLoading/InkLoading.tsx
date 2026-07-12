import { useEffect, useRef, useState, type CSSProperties } from "react";
import inkRingUrl from "./assets/ink-ring.webp";
import { getInkDryAlpha, getInkFrameState, INK_LOADING_GEOMETRY, smoothstep } from "./inkLoadingCore";
import "./inkLoading.css";

export interface InkLoadingProps {
    size?: number | string;
    label?: string;
    announce?: boolean;
    className?: string;
    style?: CSSProperties;
    speed?: number;
    paused?: boolean;
    "data-testid"?: string;
}

type PreparedInk = {
    width: number;
    height: number;
    sourceAlpha: Uint8ClampedArray;
    sourceAngle: Float32Array;
    strokeIndices: number[];
};

const preparedCache = new Map<string, PreparedInk>();
let imagePromise: Promise<HTMLImageElement> | undefined;
let didWarn = false;

function loadInkImage() {
    if (typeof Image === "undefined") {
        return Promise.reject(new Error("InkLoading requires a browser image implementation"));
    }
    imagePromise ??= new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("InkLoading WebP asset failed to load"));
        image.src = inkRingUrl;
    });
    return imagePromise;
}

function resolveCssSize(value: number | string) {
    return typeof value === "number" ? `${value}px` : value;
}

function prepareInk(image: HTMLImageElement, width: number, height: number): PreparedInk {
    const key = `${inkRingUrl}:${width}x${height}`;
    const cached = preparedCache.get(key);
    if (cached) return cached;

    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const context = offscreen.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("InkLoading canvas context is unavailable");

    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const source = context.getImageData(0, 0, width, height);
    const sourceAlpha = new Uint8ClampedArray(width * height);
    const sourceAngle = new Float32Array(width * height);
    const strokeIndices: number[] = [];
    const startAngle = INK_LOADING_GEOMETRY.startDeg * Math.PI / 180;
    const centerX = INK_LOADING_GEOMETRY.sourceCenterX * (width / INK_LOADING_GEOMETRY.sourceWidth);
    const centerY = INK_LOADING_GEOMETRY.sourceCenterY * (height / INK_LOADING_GEOMETRY.sourceHeight);

    for (let sourceIndex = 0, pixelIndex = 0; sourceIndex < source.data.length; sourceIndex += 4, pixelIndex++) {
        const alpha = source.data[sourceIndex + 3];
        sourceAlpha[pixelIndex] = alpha;
        if (alpha === 0) continue;
        const x = pixelIndex % width;
        const y = (pixelIndex / width) | 0;
        let angle = Math.atan2(y - centerY, x - centerX);
        if (angle < 0) angle += Math.PI * 2;
        if (angle < startAngle) angle += Math.PI * 2;
        sourceAngle[pixelIndex] = angle;
        strokeIndices.push(pixelIndex);
    }

    const prepared = { width, height, sourceAlpha, sourceAngle, strokeIndices };
    preparedCache.set(key, prepared);
    return prepared;
}

function renderFrame(
    context: CanvasRenderingContext2D,
    prepared: PreparedInk,
    reveal: number,
    dryProgress: number,
    output: ImageData
) {
    const pixels = output.data;
    pixels.fill(0);
    const startAngle = INK_LOADING_GEOMETRY.startDeg * Math.PI / 180;
    const endAngle = (INK_LOADING_GEOMETRY.gapStartDeg + 360) * Math.PI / 180;
    const revealAngle = startAngle + (endAngle - startAngle) * reveal;
    const solidAngle = revealAngle - INK_LOADING_GEOMETRY.feather;
    const strokeSpan = endAngle - startAngle;

    for (const pixelIndex of prepared.strokeIndices) {
        const angle = prepared.sourceAngle[pixelIndex];
        let alpha = 0;
        if (angle <= solidAngle) {
            alpha = prepared.sourceAlpha[pixelIndex];
        } else if (angle < revealAngle + INK_LOADING_GEOMETRY.feather) {
            const mix = 1 - smoothstep(solidAngle, revealAngle + INK_LOADING_GEOMETRY.feather, angle);
            alpha = prepared.sourceAlpha[pixelIndex] * mix;
        }
        const pixelProgress = Math.max(0, Math.min(1, (angle - startAngle) / strokeSpan));
        alpha *= getInkDryAlpha(pixelProgress, dryProgress);
        pixels[pixelIndex * 4 + 3] = Math.round(alpha);
    }
    context.putImageData(output, 0, 0);
}

export function InkLoading({
    size = 48,
    label = "加载中",
    announce = true,
    className,
    style,
    speed = 1,
    paused = false,
    "data-testid": dataTestId
}: InkLoadingProps) {
    const rootRef = useRef<HTMLSpanElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fallback, setFallback] = useState(false);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas || paused) return;

        let frameId = 0;
        let disposed = false;
        let prepared: PreparedInk | undefined;
        let output: ImageData | undefined;
        let context: CanvasRenderingContext2D | null = null;
        let startedAt: number | undefined;
        const media = typeof window.matchMedia === "function"
            ? window.matchMedia("(prefers-reduced-motion: reduce)")
            : undefined;
        let reducedMotion = media?.matches ?? false;
        let visible = document.visibilityState !== "hidden";

        const drawStatic = () => {
            if (!context || !prepared || !output) return;
            renderFrame(context, prepared, 1, 0, output);
        };
        const tick = (timestamp: number) => {
            if (disposed || !context || !prepared || !output) return;
            if (!visible) return;
            startedAt ??= timestamp;
            if (reducedMotion) {
                drawStatic();
                return;
            }
            const frame = getInkFrameState(timestamp - startedAt, speed);
            if (frame.phase === "pause") context.clearRect(0, 0, prepared.width, prepared.height);
            else renderFrame(context, prepared, frame.reveal, frame.dryProgress, output);
            frameId = window.requestAnimationFrame(tick);
        };
        const resume = () => {
            window.cancelAnimationFrame(frameId);
            if (visible && !disposed) frameId = window.requestAnimationFrame(tick);
        };
        const handleVisibility = () => {
            visible = document.visibilityState !== "hidden";
            resume();
        };
        const handleMotion = (event: MediaQueryListEvent) => {
            reducedMotion = event.matches;
            startedAt = undefined;
            resume();
        };

        loadInkImage()
            .then(image => {
                if (disposed) return;
                const cssPixels = Math.max(1, Math.round(root.getBoundingClientRect().width || (typeof size === "number" ? size : 48)));
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const pixels = Math.max(1, Math.round(cssPixels * dpr));
                canvas.width = pixels;
                canvas.height = pixels;
                context = canvas.getContext("2d");
                if (!context) throw new Error("InkLoading output canvas context is unavailable");
                prepared = prepareInk(image, pixels, pixels);
                output = context.createImageData(pixels, pixels);
                document.addEventListener("visibilitychange", handleVisibility);
                media?.addEventListener?.("change", handleMotion);
                resume();
            })
            .catch(error => {
                if (disposed) return;
                setFallback(true);
                if (import.meta.env.DEV && !didWarn) {
                    didWarn = true;
                    console.warn("InkLoading fell back to its static asset.", error);
                }
            });

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frameId);
            document.removeEventListener("visibilitychange", handleVisibility);
            media?.removeEventListener?.("change", handleMotion);
        };
    }, [paused, size, speed]);

    const mergedStyle = { "--ink-loading-size": resolveCssSize(size), ...style } as CSSProperties;
    const classes = ["ink-loading", className].filter(Boolean).join(" ");

    return (
        <span
            ref={rootRef}
            className={classes}
            style={mergedStyle}
            role={announce ? "status" : undefined}
            aria-live={announce ? "polite" : undefined}
            aria-label={announce ? label : undefined}
            data-testid={dataTestId}
        >
            {fallback || paused ? (
                <img className="ink-loading__fallback" src={inkRingUrl} alt="" aria-hidden="true" />
            ) : (
                <canvas ref={canvasRef} className="ink-loading__canvas" aria-hidden="true" />
            )}
        </span>
    );
}
