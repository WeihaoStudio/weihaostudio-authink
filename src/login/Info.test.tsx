import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";

describe("AuthInk info page", () => {
    it("uses the redirect URI before other continuation URLs and sanitizes server content", () => {
        const kcContext = getKcContextMock({
            pageId: "info.ftl",
            overrides: {
                messageHeader: "操作完成",
                message: { type: "success", summary: "邮箱已验证<script>alert(1)</script>" },
                skipLink: false,
                pageRedirectUri: "https://app.example.test/redirect",
                actionUri: "https://sso.example.test/action",
                client: { baseUrl: "https://app.example.test" }
            }
        });

        const { container } = render(<KcPage kcContext={kcContext} />);

        expect(container.querySelector(".auth-browser--production")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "操作完成" })).toBeInTheDocument();
        expect(screen.getByText(/邮箱已验证/)).toBeInTheDocument();
        expect(container.querySelector("script")).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: "返回应用" })).toHaveAttribute(
            "href",
            "https://app.example.test/redirect"
        );
    });

    it("does not render a continuation link when Keycloak requests skipLink", () => {
        const kcContext = getKcContextMock({
            pageId: "info.ftl",
            overrides: { skipLink: true, pageRedirectUri: "https://app.example.test" }
        });
        render(<KcPage kcContext={kcContext} />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
