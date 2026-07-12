import { getKcContext } from "./KcContext";

const DARK_THEME_CLASS = "pf-v5-theme-dark";
export type AccountTheme = "light" | "dark";
export type AccountThemeState = { initialTheme: AccountTheme; isThemeLocked: boolean };

export function applyAccountTheme(theme: AccountTheme) {
    const isDark = theme === "dark";
    const elementId = "root-color-scheme-style";
    document.getElementById(elementId)?.remove();
    const element = document.createElement("style");
    element.id = elementId;
    element.innerHTML = `:root { color-scheme: ${theme}; }`;
    document.head.appendChild(element);
    document.documentElement.style.removeProperty("background-color");
    document.documentElement.classList.toggle(DARK_THEME_CLASS, isDark);
    document.documentElement.dataset.authinkTheme = theme;
    window.dispatchEvent(new CustomEvent("authink-theme-change", { detail: theme }));
}

export function getPreferredAccountTheme(): AccountTheme {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getAccountThemeState(): AccountThemeState {
    const { kcContext } = getKcContext();
    const isThemeLocked = kcContext.darkMode === false || String(kcContext.darkMode) === "false";

    return {
        initialTheme: isThemeLocked ? "light" : getPreferredAccountTheme(),
        isThemeLocked
    };
}

export function startColorSchemeManagement() {
    applyAccountTheme(getAccountThemeState().initialTheme);
}
