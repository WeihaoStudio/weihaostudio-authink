import { useEffect, useState } from "react";
import { applyAccountTheme, type AccountTheme } from "./colorScheme";

const STORAGE_KEY = "authink-account-theme";

export function AccountThemeToggle(props: { initialTheme: AccountTheme }) {
    const [theme, setTheme] = useState<AccountTheme>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === "dark" || stored === "light" ? stored : props.initialTheme;
    });

    useEffect(() => {
        applyAccountTheme(theme);
    }, [theme]);

    return (
        <button
            type="button"
            className="authink-account-theme-toggle"
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
