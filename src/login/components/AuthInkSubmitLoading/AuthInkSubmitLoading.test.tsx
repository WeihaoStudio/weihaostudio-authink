import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthInkSubmitLoading } from "./AuthInkSubmitLoading";

describe("AuthInkSubmitLoading", () => {
    it("presents a centered, readable and accessible verification stage", () => {
        const { container } = render(<AuthInkSubmitLoading paused />);
        const status = screen.getByRole("status", { name: "正在验证身份，请稍候" });

        expect(status).toHaveAttribute("aria-live", "polite");
        expect(status).toHaveClass("authink-submit-loading");
        expect(screen.getByText("正在验证身份…")).toHaveClass(
            "authink-submit-loading__message"
        );
        expect(
            container.querySelector(".authink-submit-loading__visual")
        ).toBeInTheDocument();

        const ink = container.querySelector(".ink-loading");
        expect(ink).toHaveStyle("--ink-loading-size: 64px");
        expect(ink).not.toHaveAttribute("role");
    });
});
