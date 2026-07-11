import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";
import { authInkAssets } from "./assets";

describe("AuthInk login contract", () => {
    it("uses distinct approved local assets", () => {
        expect(authInkAssets.backgroundLightUrl).toContain(
            "weihaostudio-keycloak-bg-light-4k-300dpi.png"
        );
        expect(authInkAssets.backgroundDarkUrl).toContain(
            "weihaostudio-keycloak-bg-dark-4k-300dpi.png"
        );
        expect(authInkAssets.backgroundLightUrl).not.toBe(authInkAssets.backgroundDarkUrl);
        expect(authInkAssets.googleIconUrl).toContain("google-g.svg");
        expect(authInkAssets.githubIconUrl).toContain("github-mark.svg");
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
        expect(screen.getByRole("textbox", { name: /用户名|邮箱/i })).toHaveAttribute(
            "name",
            "username"
        );
        expect(screen.getByLabelText(/密码/i)).toHaveAttribute("name", "password");
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
