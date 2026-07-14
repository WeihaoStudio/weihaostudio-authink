import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { applyAdminTheme, type AdminTheme } from "./colorScheme";

export function AdminThemeToggle(props: { initialTheme: AdminTheme; isThemeLocked?: boolean }) {
    const [theme, setTheme] = useState<AdminTheme>(props.initialTheme);
    const [toolbarSlot, setToolbarSlot] = useState<HTMLElement | null>(null);
    const toolbarSlotRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        localStorage.removeItem("authink-admin-theme");
    }, []);

    useLayoutEffect(() => {
        const locateToolbarSlot = () => {
            const toolbarSection = document.querySelector<HTMLElement>(
                ".pf-v5-c-masthead .pf-v5-c-toolbar__content-section"
            );

            const currentSlot = toolbarSlotRef.current;

            if (currentSlot !== null && currentSlot.parentElement !== toolbarSection) {
                currentSlot.remove();
                toolbarSlotRef.current = null;
            }

            if (toolbarSection !== null && toolbarSlotRef.current === null) {
                const nextSlot = document.createElement("div");
                nextSlot.className = "pf-v5-c-toolbar__item authink-admin-theme-toggle-slot";
                toolbarSection.prepend(nextSlot);
                toolbarSlotRef.current = nextSlot;
            }

            setToolbarSlot(current => current === toolbarSlotRef.current ? current : toolbarSlotRef.current);
        };

        locateToolbarSlot();

        const observer = new MutationObserver(locateToolbarSlot);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            toolbarSlotRef.current?.remove();
            toolbarSlotRef.current = null;
        };
    }, []);

    if (props.isThemeLocked || toolbarSlot === null) {
        return null;
    }

    return createPortal(
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
        </button>,
        toolbarSlot
    );
}
