import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";

describe("AuthInk email verification page", () => {
    it("keeps Keycloak actions while rendering the AuthInk verification shell", () => {
        const kcContext = getKcContextMock({
            pageId: "login-verify-email.ftl",
            overrides: {
                user: { email: "weihao@example.test" },
                url: {
                    loginAction: "https://sso.example.test/login-actions/required-action",
                    loginUrl: "https://sso.example.test/login"
                },
                message: {
                    type: "info",
                    summary: "验证邮件已发送"
                }
            }
        });

        const { container } = render(<KcPage kcContext={kcContext} />);

        expect(container.querySelector(".auth-browser--production")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "确认你的邮箱" })).toBeInTheDocument();
        expect(screen.getByText("weihao@example.test")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "重新发送验证邮件" })).toHaveAttribute(
            "href",
            "https://sso.example.test/login-actions/required-action"
        );
        expect(screen.getByRole("link", { name: "返回登录" })).toHaveAttribute(
            "href",
            "https://sso.example.test/login"
        );
        expect(screen.getByRole("status")).toHaveTextContent("验证邮件已发送");
    });

    it("remains usable when older Keycloak versions do not expose the email", () => {
        const kcContext = getKcContextMock({
            pageId: "login-verify-email.ftl",
            overrides: { user: undefined }
        });

        render(<KcPage kcContext={kcContext} />);

        expect(screen.getByText("请前往你的邮箱完成验证。"))
            .toBeInTheDocument();
    });
});
