import { useEffect, useState } from "react";
import { applyAdminTheme, type AdminTheme } from "./colorScheme";

const STORAGE_KEY = "authink-admin-theme";

export function AdminThemeToggle(props: { initialTheme: AdminTheme }) {
    const [theme, setTheme] = useState<AdminTheme>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === "dark" || stored === "light" ? stored : props.initialTheme;
    });

    useEffect(() => applyAdminTheme(theme), [theme]);

    return (
        <button
            type="button"
            className="authink-admin-theme-toggle"
            aria-label={theme === "light" ? "切换到夜间主题" : "切换到日间主题"}
            aria-pressed={theme === "dark"}
            onClick={() => {
                const next = theme === "light" ? "dark" : "light";
                localStorage.setItem(STORAGE_KEY, next);
                setTheme(next);
            }}
        >
            <span aria-hidden="true">{theme === "light" ? "夜" : "昼"}</span>
        </button>
    );
}
