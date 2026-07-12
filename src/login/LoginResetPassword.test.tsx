import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";

describe("AuthInk reset password request", () => {
    it("posts the Keycloak username field to the reset action", () => {
        const kcContext = getKcContextMock({
            pageId: "login-reset-password.ftl",
            overrides: {
                url: {
                    loginAction: "https://sso.example.test/login-actions/reset-credentials",
                    loginUrl: "https://sso.example.test/login"
                },
                auth: { attemptedUsername: "weihao@example.test" },
                realm: {
                    loginWithEmailAllowed: true,
                    registrationEmailAsUsername: true,
                    duplicateEmailsAllowed: false
                }
            }
        });

        const { container } = render(<KcPage kcContext={kcContext} />);
        const form = container.querySelector("form[data-authink-reset-password]");

        expect(container.querySelector(".auth-browser--production")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "找回密码" })).toBeInTheDocument();
        expect(form).toHaveAttribute(
            "action",
            "https://sso.example.test/login-actions/reset-credentials"
        );
        expect(screen.getByRole("textbox", { name: "邮箱" })).toHaveAttribute(
            "name",
            "username"
        );
        expect(screen.getByRole("textbox", { name: "邮箱" })).toHaveValue(
            "weihao@example.test"
        );
        expect(screen.getByRole("link", { name: "返回登录" })).toHaveAttribute(
            "href",
            "https://sso.example.test/login"
        );
    });

    it("uses a username label when email login is disabled", () => {
        const kcContext = getKcContextMock({
            pageId: "login-reset-password.ftl",
            overrides: {
                realm: { loginWithEmailAllowed: false }
            }
        });

        render(<KcPage kcContext={kcContext} />);

        expect(screen.getByRole("textbox", { name: "用户名" })).toHaveAttribute(
            "name",
            "username"
        );
    });
});
