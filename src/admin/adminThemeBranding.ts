import { authInkAssets } from "../login/assets";
import type { AdminTheme } from "./colorScheme";

export function getAdminBrandLogoUrl(params: {
    theme: AdminTheme;
    customLogo: string | undefined;
}): string {
    const { customLogo, theme } = params;
    if (customLogo?.trim()) {
        return customLogo;
    }
    return theme === "dark" ? authInkAssets.logoWhiteUrl : authInkAssets.logoInkUrl;
}
