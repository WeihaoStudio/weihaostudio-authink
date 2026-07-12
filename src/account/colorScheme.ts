import { getKcContext } from "./KcContext";

const DARK_THEME_CLASS = "pf-v5-theme-dark";
export type AccountTheme = "light" | "dark";

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
}

export function getPreferredAccountTheme(): AccountTheme {
    const stored = localStorage.getItem("authink-account-theme");
    if (stored === "dark" || stored === "light") {
        return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function startColorSchemeManagement() {
    const { kcContext } = getKcContext();
    if (kcContext.darkMode === false) {
        applyAccountTheme("light");
        return;
    }
    applyAccountTheme(getPreferredAccountTheme());
}
