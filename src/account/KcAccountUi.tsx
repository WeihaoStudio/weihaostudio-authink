/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/KcAccountUi.tsx" --revert
 */

import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";

import { useReducer, useEffect } from "react";
import { getPreferredAccountTheme, startColorSchemeManagement } from "./colorScheme";
import { KeycloakProvider } from "../shared/keycloak-ui-shared";
import { environment } from "./environment";
import { i18n } from "./i18n/i18n";
import { Root } from "./root/Root";
import { SessionExpirationWarningOverlay } from "../shared/SessionExpirationWarningOverlay";
import { AccountThemeToggle } from "./AccountThemeToggle";
import { authInkAssets } from "../login/assets";
import "./authink-account.css";

document.title = "Account Management";

const prI18nInitialized = i18n.init();
startColorSchemeManagement();

export default function KcAccountUi() {
    const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false);

    useEffect(() => {
        prI18nInitialized.then(() => setI18nInitialized());
    }, []);

    if (!isI18nInitialized) {
        return null;
    }

    return (
        <div
            className="authink-account"
            style={{
                "--authink-account-background-light": `url(${authInkAssets.backgroundLightUrl})`,
                "--authink-account-background-dark": `url(${authInkAssets.backgroundDarkUrl})`
            } as React.CSSProperties}
        >
            <AccountThemeToggle initialTheme={getPreferredAccountTheme()} />
            <KeycloakProvider environment={environment}>
                <Root />
                <SessionExpirationWarningOverlay warnUserSecondsBeforeAutoLogout={45} />
            </KeycloakProvider>
        </div>
    );
}
