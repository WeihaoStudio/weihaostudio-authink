import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AccountLoading } from "./AccountLoading";

describe("AccountLoading", () => {
    it("renders the full-page Account loading surface by default", () => {
        const { container } = render(<AccountLoading />);

        expect(container.firstElementChild).toHaveClass(
            "authink-account-loading",
            "authink-account-loading--page"
        );
        expect(screen.getByRole("status", { name: "账户中心加载中" })).toHaveClass(
            "ink-loading"
        );
        expect(screen.getByRole("status", { name: "账户中心加载中" })).toHaveStyle(
            "--ink-loading-size: 72px"
        );
    });

    it("supports bounded section and inline loading surfaces", () => {
        const { container, rerender } = render(<AccountLoading variant="section" />);

        expect(container.firstElementChild).toHaveClass(
            "authink-account-loading--section"
        );
        expect(screen.getByRole("status", { name: "账户中心加载中" })).toHaveStyle(
            "--ink-loading-size: 64px"
        );

        rerender(<AccountLoading variant="inline" />);

        expect(container.firstElementChild).toHaveClass(
            "authink-account-loading--inline"
        );
        expect(screen.getByRole("status", { name: "账户中心加载中" })).toHaveStyle(
            "--ink-loading-size: 32px"
        );
    });
});
