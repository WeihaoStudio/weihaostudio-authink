import { fireEvent, render, screen } from "@testing-library/react";
import { getKcContextMock } from "./KcPageStory";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";

describe("AuthInk TOTP contract", () => {
    it("shows the decorative ink loading without shifting the submit button", () => {
        const kcContext = getKcContextMock({ pageId: "login-otp.ftl" });
        const { container } = render(<KcPage kcContext={kcContext} />);
        const inputs = screen.getAllByRole("textbox", { name: /第 \d 位/ });
        inputs.forEach((input, index) => fireEvent.change(input, { target: { value: String(index + 1) } }));

        const form = container.querySelector("form[data-authink-otp]");
        fireEvent.submit(form!);

        const submit = screen.getByRole("button", { name: /正在验证/ });
        expect(submit).toHaveAttribute("aria-busy", "true");
        expect(submit).toBeDisabled();
        expect(submit).toHaveClass("button--loading-stage");
        const stage = screen.getByRole("status", { name: "正在验证身份，请稍候" });
        expect(stage).toHaveClass("authink-submit-loading");
        expect(stage.parentElement).toHaveClass("authink-submit-control");
        expect(submit).not.toContainElement(stage);
        expect(stage.querySelector(".authink-submit-loading__visual")).toBeInTheDocument();
        expect(stage.querySelector(".authink-submit-loading__message")).toHaveTextContent(
            "正在验证身份…"
        );
        const ink = stage.querySelector(".ink-loading");
        expect(ink).toHaveStyle("--ink-loading-size: 64px");
        expect(ink).not.toHaveAttribute("role");
    });
});
