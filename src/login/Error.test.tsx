import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";

describe("AuthInk error page", () => {
    it("shows sanitized Keycloak error content and the application return URL", () => {
        const kcContext = getKcContextMock({
            pageId: "error.ftl",
            overrides: {
                message: { type: "error", summary: "请求已失效<img src=x onerror=alert(1)>" },
                skipLink: false,
                client: { baseUrl: "https://app.example.test" }
            }
        });
        const { container } = render(<KcPage kcContext={kcContext} />);

        expect(container.querySelector(".auth-browser--production")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "无法完成操作" })).toBeInTheDocument();
        expect(screen.getByText(/请求已失效/)).toBeInTheDocument();
        expect(container.querySelector("img[src='x']")).not.toHaveAttribute("onerror");
        expect(screen.getByRole("link", { name: "返回应用" })).toHaveAttribute(
            "href",
            "https://app.example.test"
        );
    });

    it("respects skipLink", () => {
        const kcContext = getKcContextMock({
            pageId: "error.ftl",
            overrides: { skipLink: true, client: { baseUrl: "https://app.example.test" } }
        });
        render(<KcPage kcContext={kcContext} />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
