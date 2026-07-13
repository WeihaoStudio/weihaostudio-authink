export const INK_LOADING_TIMING = {
    drawMs: 3000,
    holdMs: 600,
    dryMs: 3600,
    pauseMs: 280
} as const;

export const INK_LOADING_GEOMETRY = {
    startDeg: 279.5,
    gapStartDeg: 249.5,
    feather: 0.11,
    dryTrail: 0.18,
    sourceWidth: 1254,
    sourceHeight: 1254,
    sourceCenterX: 640.1,
    sourceCenterY: 601.0
} as const;

export type InkFrameState =
    | { phase: "draw"; reveal: number; dryProgress: 0; alpha: 1 }
    | { phase: "hold"; reveal: 1; dryProgress: 0; alpha: 1 }
    | { phase: "dry"; reveal: 1; dryProgress: number }
    | { phase: "pause"; reveal: 0; dryProgress: 1 };

const easeInOutSine = (value: number) => (1 - Math.cos(Math.PI * value)) / 2;

export function getInkFrameState(elapsedMs: number, speed = 1): InkFrameState {
    const safeSpeed = Number.isFinite(speed) && speed > 0 ? speed : 1;
    const { drawMs, holdMs, dryMs, pauseMs } = INK_LOADING_TIMING;
    const totalMs = drawMs + holdMs + dryMs + pauseMs;
    const phase = ((elapsedMs * safeSpeed) % totalMs + totalMs) % totalMs;

    if (phase < drawMs) {
        return { phase: "draw", reveal: easeInOutSine(phase / drawMs), dryProgress: 0, alpha: 1 };
    }
    if (phase < drawMs + holdMs) {
        return { phase: "hold", reveal: 1, dryProgress: 0, alpha: 1 };
    }
    if (phase < drawMs + holdMs + dryMs) {
        return {
            phase: "dry",
            reveal: 1,
            dryProgress: (phase - drawMs - holdMs) / dryMs
        };
    }
    return { phase: "pause", reveal: 0, dryProgress: 1 };
}

export function smoothstep(edge0: number, edge1: number, value: number) {
    const progress = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
    return progress * progress * (3 - 2 * progress);
}

export function getInkDryAlpha(pixelProgress: number, dryProgress: number) {
    const normalizedPixel = Math.max(0, Math.min(1, pixelProgress));
    const normalizedDry = Math.max(0, Math.min(1, dryProgress));
    const trail = INK_LOADING_GEOMETRY.dryTrail;
    const dryingFront = normalizedDry * (1 + trail);
    return 1 - smoothstep(0, trail, dryingFront - normalizedPixel);
}
