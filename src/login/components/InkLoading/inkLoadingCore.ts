export const INK_LOADING_TIMING = {
    drawMs: 1800,
    holdMs: 360,
    fadeMs: 920,
    pauseMs: 180
} as const;

export const INK_LOADING_GEOMETRY = {
    startDeg: 279.5,
    gapStartDeg: 249.5,
    feather: 0.11,
    sourceWidth: 1254,
    sourceHeight: 1254,
    sourceCenterX: 640.1,
    sourceCenterY: 601.0
} as const;

export type InkFrameState =
    | { phase: "draw"; reveal: number; alpha: 1 }
    | { phase: "hold"; reveal: 1; alpha: 1 }
    | { phase: "fade"; reveal: 1; alpha: number }
    | { phase: "pause"; reveal: 0; alpha: 0 };

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
const easeInOutSine = (value: number) => -(Math.cos(Math.PI * value) - 1) / 2;

export function getInkFrameState(elapsedMs: number, speed = 1): InkFrameState {
    const safeSpeed = Number.isFinite(speed) && speed > 0 ? speed : 1;
    const { drawMs, holdMs, fadeMs, pauseMs } = INK_LOADING_TIMING;
    const totalMs = drawMs + holdMs + fadeMs + pauseMs;
    const phase = ((elapsedMs * safeSpeed) % totalMs + totalMs) % totalMs;

    if (phase < drawMs) {
        return { phase: "draw", reveal: easeOutCubic(phase / drawMs), alpha: 1 };
    }
    if (phase < drawMs + holdMs) {
        return { phase: "hold", reveal: 1, alpha: 1 };
    }
    if (phase < drawMs + holdMs + fadeMs) {
        const progress = (phase - drawMs - holdMs) / fadeMs;
        return { phase: "fade", reveal: 1, alpha: 1 - easeInOutSine(progress) };
    }
    return { phase: "pause", reveal: 0, alpha: 0 };
}

export function smoothstep(edge0: number, edge1: number, value: number) {
    const progress = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
    return progress * progress * (3 - 2 * progress);
}
