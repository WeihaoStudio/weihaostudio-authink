import { useEffect, useState } from "react";
import { applyAccountTheme, type AccountTheme } from "./colorScheme";

export function AccountThemeToggle(props: { initialTheme: AccountTheme; isThemeLocked?: boolean }) {
    const [theme, setTheme] = useState<AccountTheme>(props.initialTheme);

    useEffect(() => {
        localStorage.removeItem("authink-account-theme");
    }, []);

    if (props.isThemeLocked) {
        return null;
    }

    return (
        <button
            type="button"
            className="authink-account-theme-toggle"
            aria-label={theme === "light" ? "切换到夜间主题" : "切换到日间主题"}
            aria-pressed={theme === "dark"}
            onClick={() => {
                const nextTheme = theme === "light" ? "dark" : "light";
                setTheme(nextTheme);
                applyAccountTheme(nextTheme);
            }}
        >
            <span aria-hidden="true">{theme === "light" ? "夜" : "昼"}</span>
        </button>
    );
}
