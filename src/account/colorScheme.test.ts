import { afterEach, describe, expect, it, vi } from "vitest";

const { getKcContext } = vi.hoisted(() => ({ getKcContext: vi.fn() }));
vi.mock("./KcContext", () => ({ getKcContext }));

import * as colorScheme from "./colorScheme";

type ThemeState = { initialTheme: "light" | "dark"; isThemeLocked: boolean };

const getThemeState = () =>
    (colorScheme as typeof colorScheme & { getAccountThemeState?: () => ThemeState }).getAccountThemeState?.();

describe("AuthInk Account color scheme management", () => {
    afterEach(() => {
        document.documentElement.classList.remove("pf-v5-theme-dark");
        document.documentElement.removeAttribute("data-authink-theme");
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it.each([false, "false"])("forces and locks light mode when darkMode is %p", darkMode => {
        localStorage.setItem("authink-account-theme", "dark");
        getKcContext.mockReturnValue({ kcContext: { darkMode } });

        colorScheme.startColorSchemeManagement();

        expect(document.documentElement).toHaveAttribute("data-authink-theme", "light");
        expect(document.documentElement).not.toHaveClass("pf-v5-theme-dark");
        expect(getThemeState()).toEqual({ initialTheme: "light", isThemeLocked: true });
    });
});
