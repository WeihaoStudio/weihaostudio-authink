import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";
import { authInkAssets } from "./assets";

describe("AuthInk login contract", () => {
    it("uses approved local login assets", () => {
        expect(authInkAssets.backgroundLightUrl).toContain(
            "weihaostudio-keycloak-bg-light-4k-300dpi.png"
        );
        expect(authInkAssets.googleIconUrl).toContain("google-g.svg");
        expect(authInkAssets.githubIconUrl).toContain("github-mark.svg");
    });

    it("matches the approved desktop authentication-card structure", () => {
        const kcContext = getKcContextMock({ pageId: "login.ftl" });
        const { container } = render(<KcPage kcContext={kcContext} />);

        expect(container.querySelector(".visual")).toBeInTheDocument();
        expect(container.querySelector(".panel .auth-card")).toBeInTheDocument();
        expect(container.querySelector(".auth-card__logo")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "欢迎回来" })).toBeInTheDocument();
        expect(screen.getByText("使用您的账号安全登录。")).toBeInTheDocument();
        expect(container.querySelector(".authink-theme-toggle")).not.toBeInTheDocument();
        expect(container.querySelector(".authink-eyebrow")).not.toBeInTheDocument();
        expect(container.querySelector(".authink-visual__caption")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "登录" })).toBeInTheDocument();
    });

    it("uses one fixed 4K wallpaper without a gradient or dark-image rotation", () => {
        const kcContext = getKcContextMock({ pageId: "login.ftl" });
        const { container } = render(<KcPage kcContext={kcContext} />);
        const shell = container.querySelector(".auth-browser--production");

        expect(shell).toHaveStyle(
            `--auth-light-background: url(${authInkAssets.backgroundLightUrl})`
        );
        expect(shell?.getAttribute("style")).not.toContain("weihaostudio-keycloak-bg-dark");
        expect(shell).not.toHaveAttribute("data-theme");
    });

    it("posts to Keycloak and renders accessible local-provider controls", () => {
        const kcContext = getKcContextMock({
            pageId: "login.ftl",
            overrides: {
                url: {
                    loginAction: "https://sso.example.test/login-actions/authenticate"
                },
                message: {
                    type: "error",
                    summary: "用户名或密码错误"
                },
                social: {
                    displayInfo: true,
                    providers: [
                        {
                            loginUrl: "https://sso.example.test/google",
                            alias: "google",
                            providerId: "google",
                            displayName: "Google"
                        },
                        {
                            loginUrl: "https://sso.example.test/github",
                            alias: "github",
                            providerId: "github",
                            displayName: "GitHub"
                        }
                    ]
                }
            }
        });

        const { container } = render(<KcPage kcContext={kcContext} />);

        const form = container.querySelector("form[data-authink-login]");
        expect(form).toHaveAttribute(
            "action",
            "https://sso.example.test/login-actions/authenticate"
        );
        expect(screen.getByRole("textbox", { name: /用户名|邮箱|username|email/i })).toHaveAttribute(
            "name",
            "username"
        );
        expect(container.querySelector('input[name="password"]')).toHaveAttribute("name", "password");
        expect(screen.getByRole("alert")).toHaveTextContent("用户名或密码错误");
        expect(screen.getByRole("link", { name: /Google/i })).toHaveAttribute(
            "href",
            "https://sso.example.test/google"
        );
        expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
            "href",
            "https://sso.example.test/github"
        );
        expect(container.querySelector('img[src*="google-g.svg"]')).toBeInTheDocument();
        expect(container.querySelector('img[src*="github-mark.svg"]')).toBeInTheDocument();
    });
});
