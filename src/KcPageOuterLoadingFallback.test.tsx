import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { KcContext } from "./kc.gen";

vi.mock("./login/KcPage", () => new Promise(() => undefined));

import { KcPage } from "./kc.gen";

describe("KcPage outer loading fallback", () => {
    it("renders its caller-provided fallback while the lazy Login page chunk is pending", () => {
        render(
            <KcPage
                kcContext={{ themeType: "login" } as KcContext}
                fallback={<div data-testid="outer-login-loading">正在加载登录页</div>}
            />
        );

        expect(screen.getByTestId("outer-login-loading")).toBeVisible();
    });
});
