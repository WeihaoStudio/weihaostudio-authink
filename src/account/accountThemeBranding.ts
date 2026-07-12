import { authInkAssets } from "../login/assets";
import type { AccountTheme } from "./colorScheme";

export function getAccountBrandLogoUrl(theme: AccountTheme): string {
    return theme === "dark" ? authInkAssets.logoWhiteUrl : authInkAssets.logoInkUrl;
}
