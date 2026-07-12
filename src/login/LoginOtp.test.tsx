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
        expect(submit.querySelector(".ink-loading")).toBeInTheDocument();
        expect(submit.querySelector(".ink-loading")).not.toHaveAttribute("role");
    });
});
