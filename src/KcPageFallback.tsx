import type { ReactNode } from "react";
import type { KcContext } from "./kc.gen";
import { LoginPageLoading } from "./login/LoginPageLoading";

/**
 * This module stays in the entry chunk so the Login fallback is available
 * before the lazy Login page chunk can resolve.
 */
export function getKcPageFallback(
    kcContext: Pick<KcContext, "themeType">
): ReactNode | undefined {
    return kcContext.themeType === "login" ? <LoginPageLoading /> : undefined;
}
