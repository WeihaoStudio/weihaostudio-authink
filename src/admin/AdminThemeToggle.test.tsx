import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { applyAdminTheme } from "./colorScheme";

function mountMastheadToolbar() {
    document.body.innerHTML = `
        <header class="pf-v5-c-masthead">
            <div class="pf-v5-c-masthead__content">
                <div class="pf-v5-c-toolbar__content-section"></div>
            </div>
        </header>
    `;
}

describe("AuthInk Admin theme toggle", () => {
    afterEach(() => {
        cleanup();
        document.documentElement.classList.remove("pf-v5-theme-dark");
        document.documentElement.removeAttribute("data-theme");
        localStorage.clear();
        document.body.innerHTML = "";
    });

    it("keeps PatternFly dark mode synchronized with the AuthInk theme", () => {
        applyAdminTheme("dark");
        expect(document.documentElement).toHaveClass("pf-v5-theme-dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "dark");
        applyAdminTheme("light");
        expect(document.documentElement).not.toHaveClass("pf-v5-theme-dark");
    });

    it("uses the approved 夜/昼 button without persisting the choice", async () => {
        localStorage.setItem("authink-admin-theme", "dark");
        mountMastheadToolbar();
        render(<AdminThemeToggle initialTheme="light" />);

        const button = screen.getByRole("button", { name: "切换到夜间主题" });
        expect(button).toHaveTextContent("夜");

        await userEvent.setup().click(button);

        expect(screen.getByRole("button", { name: "切换到日间主题" })).toHaveTextContent("昼");
        expect(localStorage.getItem("authink-admin-theme")).toBeNull();
    });
});

it("does not render or re-apply a theme when the realm locks light mode", () => {
    applyAdminTheme("light");
    render(<AdminThemeToggle initialTheme="dark" isThemeLocked />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
});
