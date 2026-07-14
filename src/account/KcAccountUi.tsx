/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260601.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/KcAccountUi.tsx" --revert
 */

import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";

import { useReducer, useEffect, useState } from "react";
import { getAccountThemeState, startColorSchemeManagement } from "./colorScheme";
import { KeycloakProvider } from "../shared/keycloak-ui-shared";
import { environment } from "./environment";
import { i18n } from "./i18n/i18n";
import { Root } from "./root/Root";
import { SessionExpirationWarningOverlay } from "../shared/SessionExpirationWarningOverlay";
import { AccountThemeToggle } from "./AccountThemeToggle";
import { AccountLoading } from "./AccountLoading";
import "../login/authink.tokens.css";
import "./authink-account.css";

document.title = "账户中心";

const prI18nInitialized = i18n.init();
startColorSchemeManagement();

// 错误页组件
function AccountInitError({ errorCode, onRetry }: { errorCode: string; onRetry: () => void }) {
    const themeState = getAccountThemeState();
    
    return (
        <div className="authink-account-error">
            <div className="authink-account-error-card">
                <h1 className="authink-account-error-title">暂时无法访问账户中心</h1>
                <p className="authink-account-error-code">错误代码：{errorCode}</p>
                <p className="authink-account-error-desc">请检查网络连接，或稍后重试</p>
                <div className="authink-account-error-actions">
                    <button 
                        className="authink-button authink-button-secondary"
                        onClick={onRetry}
                    >
                        重新加载
                    </button>
                    <button 
                        className="authink-button authink-button-primary"
                        onClick={() => window.location.href = `${environment.serverBaseUrl}/realms/${environment.realm}/login-actions/logout`}
                    >
                        返回登录
                    </button>
                </div>
            </div>
            <AccountThemeToggle {...themeState} />
        </div>
    );
}

export default function KcAccountUi() {
    const [isI18nInitialized, setI18nInitialized] = useReducer(() => true, false);
    const [initTimedOut, setInitTimedOut] = useState(false);
    const [isKeycloakInitialized, setKeycloakInitialized] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    // i18n 初始化，5秒超时降级
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // 超时直接使用默认 fallback
            setI18nInitialized();
        }, 5000);

        prI18nInitialized
            .then(() => setI18nInitialized())
            .catch(() => {
                // 初始化失败也降级到默认
                setI18nInitialized();
            })
            .finally(() => clearTimeout(timeoutId));
    }, [retryKey]);

    // Keycloak bootstrap 10 秒未完成时退出无限 Loading。
    useEffect(() => {
        if (!isI18nInitialized || isKeycloakInitialized) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setInitTimedOut(true);
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, [isI18nInitialized, isKeycloakInitialized, retryKey]);

    // 重试处理
    const handleRetry = () => {
        setInitTimedOut(false);
        setKeycloakInitialized(false);
        setRetryKey(prev => prev + 1);
    };

    // 超时显示错误页
    if (initTimedOut) {
        return (
            <AccountInitError 
                errorCode="INIT-001" 
                onRetry={handleRetry}
            />
        );
    }

    // i18n还没初始化完成，显示加载中
    if (!isI18nInitialized) {
        const themeState = getAccountThemeState();
        
        return (
            <div className="authink-account-loading-container">
                <AccountLoading variant="page" />
                <AccountThemeToggle {...themeState} />
            </div>
        );
    }

    const themeState = getAccountThemeState();

    return (
        <div className="authink-account">
            <AccountThemeToggle {...themeState} />
            <KeycloakProvider
                key={retryKey}
                environment={environment}
                loadingFallback={<AccountLoading variant="page" />}
                onReady={() => setKeycloakInitialized(true)}
                onError={() => setInitTimedOut(true)}
            >
                <Root />
                <SessionExpirationWarningOverlay warnUserSecondsBeforeAutoLogout={45} />
            </KeycloakProvider>
        </div>
    );
}
