import { getKcContext } from "./KcContext";

const DARK_THEME_CLASS = "pf-v5-theme-dark";
export type AdminTheme = "light" | "dark";
export type AdminThemeState = { initialTheme: AdminTheme; isThemeLocked: boolean };

export function applyAdminTheme(theme: AdminTheme) {
    document.getElementById("root-color-scheme-style")?.remove();
    const element = document.createElement("style");
    element.id = "root-color-scheme-style";
    element.innerHTML = `:root { color-scheme: ${theme}; }`;
    document.head.appendChild(element);
    document.documentElement.style.removeProperty("background-color");
    document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === "dark");
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent("authink-theme-change", { detail: theme }));
}

export function getPreferredAdminTheme(): AdminTheme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getAdminThemeState(): AdminThemeState {
    const { kcContext } = getKcContext();
    const isThemeLocked = kcContext.darkMode === false || String(kcContext.darkMode) === "false";

    return {
        initialTheme: isThemeLocked ? "light" : getPreferredAdminTheme(),
        isThemeLocked
    };
}

export function startColorSchemeManagement() {
    applyAdminTheme(getAdminThemeState().initialTheme);
}
