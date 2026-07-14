/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/context/KeycloakContext.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Spinner } from "../../@patternfly/react-core";
import { Keycloak } from "oidc-spa/keycloak-js";
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode
} from "react";
import { AlertProvider } from "../alerts/Alerts";
import { ErrorPage } from "./ErrorPage";
import { Help } from "./HelpContext";
import { BaseEnvironment } from "./environment";

export type KeycloakContext<T extends BaseEnvironment = BaseEnvironment> =
    KeycloakContextProps<T> & {
        keycloak: Keycloak;
    };

const createKeycloakEnvContext = <T extends BaseEnvironment>() =>
    createContext<KeycloakContext<T> | undefined>(undefined);

let KeycloakEnvContext: any;

export const useEnvironment = <T extends BaseEnvironment = BaseEnvironment>() => {
    const context = useContext<KeycloakContext<T>>(KeycloakEnvContext);
    if (!context)
        throw Error(
            "no environment provider in the hierarchy make sure to add the provider"
        );
    return context;
};

interface KeycloakContextProps<T extends BaseEnvironment> {
    environment: T;
    keycloak?: Keycloak;
    /** Optional AuthInk-compatible bootstrap UI. Defaults to PatternFly Spinner. */
    loadingFallback?: ReactNode;
    /** Called once the OIDC client has initialized successfully. */
    onReady?: () => void;
    /** Called when the OIDC client initialization rejects. */
    onError?: (error: unknown) => void;
}

export const KeycloakProvider = <T extends BaseEnvironment>({
    environment,
    keycloak: externalKeycloak,
    loadingFallback,
    onReady,
    onError,
    children
}: PropsWithChildren<KeycloakContextProps<T>>) => {
    KeycloakEnvContext = createKeycloakEnvContext<T>();
    const calledOnce = useRef(false);
    const [init, setInit] = useState(!!externalKeycloak);
    const [error, setError] = useState<unknown>();
    const keycloak = useMemo(() => {
        if (externalKeycloak) {
            return externalKeycloak;
        }
        const keycloak = new Keycloak({
            url: environment.serverBaseUrl,
            realm: environment.realm,
            clientId: environment.clientId
        });

        return keycloak;
    }, [environment, externalKeycloak]);

    useEffect(() => {
        // Skip initialization if using external keycloak (already initialized)
        if (externalKeycloak) {
            onReady?.();
            return;
        }

        // only needed in dev mode
        if (calledOnce.current) {
            return;
        }

        const init = () =>
            keycloak.init({
                onLoad: "login-required",
                pkceMethod: "S256",

                scope: environment.scope
            });

        init()
            .then(() => {
                setInit(true);
                onReady?.();
            })
            .catch(error => {
                setError(error);
                onError?.(error);
            });

        calledOnce.current = true;
    }, [keycloak, externalKeycloak, onReady, onError]);

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!init) {
        return loadingFallback ?? <Spinner />;
    }

    return (
        <KeycloakEnvContext.Provider value={{ environment, keycloak }}>
            <AlertProvider>
                <Help>{children}</Help>
            </AlertProvider>
        </KeycloakEnvContext.Provider>
    );
};
