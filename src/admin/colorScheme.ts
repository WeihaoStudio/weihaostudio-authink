import { getKcContext } from "./KcContext";

const DARK_THEME_CLASS = "pf-v5-theme-dark";
export type AdminTheme = "light" | "dark";

export function applyAdminTheme(theme: AdminTheme) {
    document.getElementById("root-color-scheme-style")?.remove();
    const element = document.createElement("style");
    element.id = "root-color-scheme-style";
    element.innerHTML = `:root { color-scheme: ${theme}; }`;
    document.head.appendChild(element);
    document.documentElement.style.removeProperty("background-color");
    document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === "dark");
    document.documentElement.dataset.authinkTheme = theme;
}

export function getPreferredAdminTheme(): AdminTheme {
    const stored = localStorage.getItem("authink-admin-theme");
    if (stored === "dark" || stored === "light") {
        return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function startColorSchemeManagement() {
    const { kcContext } = getKcContext();
    if (kcContext.darkMode === false) {
        applyAdminTheme("light");
        return;
    }
    applyAdminTheme(getPreferredAdminTheme());
}
