import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AccountThemeToggle } from "./AccountThemeToggle";
import { applyAccountTheme } from "./colorScheme";

describe("AuthInk Account theme toggle", () => {
    afterEach(() => {
        document.documentElement.classList.remove("pf-v5-theme-dark");
        document.documentElement.removeAttribute("data-theme");
        localStorage.clear();
    });

    it("applies PatternFly and AuthInk dark-mode markers", () => {
        applyAccountTheme("dark");
        expect(document.documentElement).toHaveClass("pf-v5-theme-dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "dark");

        applyAccountTheme("light");
        expect(document.documentElement).not.toHaveClass("pf-v5-theme-dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "light");
    });

    it("uses the approved 夜/昼 control without persisting the user choice", () => {
        localStorage.setItem("authink-account-theme", "dark");
        render(<AccountThemeToggle initialTheme="light" />);

        const button = screen.getByRole("button", { name: "切换到夜间主题" });
        expect(button).toHaveTextContent("夜");

        fireEvent.click(button);

        expect(screen.getByRole("button", { name: "切换到日间主题" })).toHaveTextContent("昼");
        expect(localStorage.getItem("authink-account-theme")).toBeNull();
        expect(document.documentElement).toHaveClass("pf-v5-theme-dark");
    });
});

it("does not render or re-apply a theme when the realm locks light mode", () => {
    applyAccountTheme("light");
    render(<AccountThemeToggle initialTheme="dark" isThemeLocked />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
});
