import { useEffect, useState } from "react";
import { applyAdminTheme, type AdminTheme } from "./colorScheme";

export function AdminThemeToggle(props: { initialTheme: AdminTheme; isThemeLocked?: boolean }) {
    const [theme, setTheme] = useState<AdminTheme>(props.initialTheme);

    useEffect(() => {
        localStorage.removeItem("authink-admin-theme");
    }, []);

    if (props.isThemeLocked) {
        return null;
    }

    return (
        <button
            type="button"
            className="authink-admin-theme-toggle"
            aria-label={theme === "light" ? "切换到夜间主题" : "切换到日间主题"}
            aria-pressed={theme === "dark"}
            onClick={() => {
                const nextTheme = theme === "light" ? "dark" : "light";
                setTheme(nextTheme);
                applyAdminTheme(nextTheme);
            }}
        >
            <span aria-hidden="true">{theme === "light" ? "夜" : "昼"}</span>
        </button>
    );
}
