import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { applyAdminTheme } from "./colorScheme";

describe("AuthInk Admin theme toggle", () => {
    afterEach(() => {
        document.documentElement.classList.remove("pf-v5-theme-dark");
        document.documentElement.removeAttribute("data-authink-theme");
        localStorage.clear();
    });

    it("keeps PatternFly dark mode synchronized with the AuthInk theme", () => {
        applyAdminTheme("dark");
        expect(document.documentElement).toHaveClass("pf-v5-theme-dark");
        expect(document.documentElement).toHaveAttribute("data-authink-theme", "dark");
        applyAdminTheme("light");
        expect(document.documentElement).not.toHaveClass("pf-v5-theme-dark");
    });

    it("uses the approved 夜/昼 button", () => {
        render(<AdminThemeToggle initialTheme="light" />);
        const button = screen.getByRole("button", { name: "切换到夜间主题" });
        expect(button).toHaveTextContent("夜");
        fireEvent.click(button);
        expect(screen.getByRole("button", { name: "切换到日间主题" })).toHaveTextContent("昼");
        expect(localStorage.getItem("authink-admin-theme")).toBe("dark");
    });
});
