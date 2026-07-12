import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";

describe("AuthInk password update page", () => {
    it("preserves Keycloak field names, action and session option", () => {
        const kcContext = getKcContextMock({
            pageId: "login-update-password.ftl",
            overrides: {
                url: { loginAction: "https://sso.example.test/login-actions/update-password" }
            }
        });

        const { container } = render(<KcPage kcContext={kcContext} />);
        const form = container.querySelector("form[data-authink-update-password]");

        expect(container.querySelector(".auth-browser--production")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "设置新密码" })).toBeInTheDocument();
        expect(form).toHaveAttribute(
            "action",
            "https://sso.example.test/login-actions/update-password"
        );
        expect(container.querySelector('input[name="password-new"]')).toHaveAttribute(
            "autocomplete",
            "new-password"
        );
        expect(container.querySelector('input[name="password-confirm"]')).toHaveAttribute(
            "autocomplete",
            "new-password"
        );
        expect(screen.getByRole("checkbox", { name: "退出其他设备" })).toHaveAttribute(
            "name",
            "logout-sessions"
        );
    });

    it("uses eye buttons to reveal each password without changing the other field", () => {
        const kcContext = getKcContextMock({ pageId: "login-update-password.ftl" });
        const { container } = render(<KcPage kcContext={kcContext} />);
        const password = container.querySelector<HTMLInputElement>('#password-new')!;
        const confirmation = container.querySelector<HTMLInputElement>('#password-confirm')!;

        const toggles = screen.getAllByRole("button", { name: "显示密码" });
        fireEvent.click(toggles[0]);

        expect(password.type).toBe("text");
        expect(confirmation.type).toBe("password");
        expect(toggles[0].querySelector("svg")).toBeInTheDocument();
    });

    it("keeps the app initiated cancel action", () => {
        const kcContext = getKcContextMock({
            pageId: "login-update-password.ftl",
            overrides: { isAppInitiatedAction: true }
        });

        render(<KcPage kcContext={kcContext} />);

        expect(screen.getByRole("button", { name: "取消" })).toHaveAttribute("name", "cancel-aia");
        expect(screen.getByRole("button", { name: "取消" })).toHaveValue("true");
    });
});
