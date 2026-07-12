import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AccountThemeToggle } from "./AccountThemeToggle";
import { applyAccountTheme } from "./colorScheme";

describe("AuthInk Account theme toggle", () => {
    afterEach(() => {
        document.documentElement.classList.remove("pf-v5-theme-dark");
        document.documentElement.removeAttribute("data-authink-theme");
        localStorage.clear();
    });

    it("applies PatternFly and AuthInk dark-mode markers", () => {
        applyAccountTheme("dark");
        expect(document.documentElement).toHaveClass("pf-v5-theme-dark");
        expect(document.documentElement).toHaveAttribute("data-authink-theme", "dark");

        applyAccountTheme("light");
        expect(document.documentElement).not.toHaveClass("pf-v5-theme-dark");
        expect(document.documentElement).toHaveAttribute("data-authink-theme", "light");
    });

    it("uses the approved 夜/昼 control and persists the user choice", () => {
        render(<AccountThemeToggle initialTheme="light" />);
        const button = screen.getByRole("button", { name: "切换到夜间主题" });
        expect(button).toHaveTextContent("夜");

        fireEvent.click(button);

        expect(screen.getByRole("button", { name: "切换到日间主题" })).toHaveTextContent("昼");
        expect(localStorage.getItem("authink-account-theme")).toBe("dark");
        expect(document.documentElement).toHaveClass("pf-v5-theme-dark");
    });
});
