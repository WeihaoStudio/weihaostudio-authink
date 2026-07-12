/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Header.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { KeycloakMasthead, label, useEnvironment } from "../../shared/keycloak-ui-shared";
import { Button } from "../../shared/@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "../../shared/@patternfly/react-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";

import { AccountEnvironment } from "..";
import { joinPath } from "../utils/joinPath";
import { getAccountBrandLogoUrl } from "../accountThemeBranding";
import type { AccountTheme } from "../colorScheme";

import style from "./header.module.css";

const ReferrerLink = () => {
    const { environment } = useEnvironment<AccountEnvironment>();
    const { t } = useTranslation();

    return environment.referrerUrl ? (
        <Button
            data-testid="referrer-link"
            component="a"
            href={environment.referrerUrl.replace("_hash_", "#")}
            variant="link"
            icon={<ExternalLinkSquareAltIcon />}
            iconPosition="right"
            isInline
        >
            {t("backTo", {
                app: label(t, environment.referrerName, environment.referrerUrl)
            })}
        </Button>
    ) : null;
};

function currentTheme(): AccountTheme {
    return document.documentElement.dataset.authinkTheme === "dark" ? "dark" : "light";
}

export const Header = () => {
    const [theme, setTheme] = useState<AccountTheme>(currentTheme);

    useEffect(() => {
        const syncTheme = () => setTheme(currentTheme());
        window.addEventListener("authink-theme-change", syncTheme);
        return () => window.removeEventListener("authink-theme-change", syncTheme);
    }, []);
    const { environment, keycloak } = useEnvironment();
    const { t } = useTranslation();

    const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
    const internalLogoHref = useHref(logoUrl);

    // User can indicate that he wants an internal URL by starting it with "/"
    const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

    return (
        <KeycloakMasthead
            data-testid="page-header"
            keycloak={keycloak}
            features={{ hasManageAccount: false }}
            brand={{
                href: indexHref,
                src: getAccountBrandLogoUrl(theme),
                alt: "WeihaoStudio",
                className: style.brand
            }}
            toolbarItems={[<ReferrerLink key="link" />]}
        />
    );
};
