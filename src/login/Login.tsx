import { useState } from "react";
import { InkLoading } from "./components/InkLoading";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { authInkAssets } from "./assets";

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template } = props;
    const { social, realm, url, usernameHidden, login, auth, messagesPerField } = kcContext;
    const { msgStr } = i18n;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasCredentialError = messagesPerField.existsError("username", "password");
    const credentialError = hasCredentialError
        ? messagesPerField.getFirstError("username", "password")
        : undefined;
    const providers = social?.providers ?? [];

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode="欢迎回来"
            displayMessage={!hasCredentialError}
        >
            <form
                className="form-stack"
                data-authink-login
                action={url.loginAction}
                method="post"
                onSubmit={() => setIsSubmitting(true)}
            >
                {!usernameHidden && (
                    <div className="field">
                        <label htmlFor="username">用户名或邮箱</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            defaultValue={login.username ?? ""}
                            placeholder="请输入用户名或邮箱"
                            autoComplete="username"
                            autoFocus
                            aria-invalid={hasCredentialError}
                            aria-describedby={hasCredentialError ? "authink-credential-error" : undefined}
                        />
                    </div>
                )}

                <div className="field">
                    <label htmlFor="password">密码</label>
                    <div className="password-field">
                        <input
                            id="password"
                            name="password"
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="请输入密码"
                            autoComplete="current-password"
                            aria-invalid={hasCredentialError}
                            aria-describedby={hasCredentialError ? "authink-credential-error" : undefined}
                        />
                        <button
                            className="password-toggle"
                            type="button"
                            onClick={() => setIsPasswordVisible(value => !value)}
                            aria-controls="password"
                            aria-label={isPasswordVisible ? msgStr("hidePassword") : msgStr("showPassword")}
                            aria-pressed={isPasswordVisible}
                        >
                            {isPasswordVisible ? (
                                <svg
                                    className="password-toggle__icon"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M3 3l18 18" />
                                    <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                                    <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5.4 9 5.4a14.7 14.7 0 0 1-2.1 2.8" />
                                    <path d="M6.6 6.6C4.3 8.1 3 10.4 3 10.4S6.5 16 12 16a9.8 9.8 0 0 0 3.4-.6" />
                                </svg>
                            ) : (
                                <svg
                                    className="password-toggle__icon"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
                                    <circle cx="12" cy="12" r="2.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {credentialError !== undefined && (
                    <div
                        id="authink-credential-error"
                        className="field-error"
                        role="alert"
                        dangerouslySetInnerHTML={{ __html: kcSanitize(credentialError) }}
                    />
                )}

                <div className="helper-row">
                    {realm.rememberMe && !usernameHidden ? (
                        <label className="check-row">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                defaultChecked={Boolean(login.rememberMe)}
                            />
                            <span className="check-row__box" aria-hidden="true" />
                            <span>记住我</span>
                        </label>
                    ) : (
                        <span />
                    )}
                    {realm.resetPasswordAllowed && (
                        <a href={url.loginResetCredentialsUrl}>忘记密码？</a>
                    )}
                </div>

                <input type="hidden" name="credentialId" value={auth.selectedCredential} />
                <button
                    className="button button--primary"
                    name="login"
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting && <InkLoading size={20} announce={false} />}
                    <span>{isSubmitting ? "正在验证…" : "登录"}</span>
                </button>

                {providers.length > 0 && (
                    <>
                        <div className="separator">或使用以下方式登录</div>
                        {providers.map(provider => {
                            const normalizedProvider = `${provider.alias} ${provider.providerId}`.toLowerCase();
                            const iconUrl = normalizedProvider.includes("google")
                                ? authInkAssets.googleIconUrl
                                : normalizedProvider.includes("github")
                                  ? authInkAssets.githubIconUrl
                                  : undefined;

                            return (
                                <a
                                    className="button button--secondary"
                                    href={provider.loginUrl}
                                    key={provider.alias}
                                >
                                    {iconUrl !== undefined && (
                                        <span className="provider-icon" aria-hidden="true">
                                            <img src={iconUrl} alt="" />
                                        </span>
                                    )}
                                    使用 {provider.displayName} 登录
                                </a>
                            );
                        })}
                    </>
                )}
            </form>
        </Template>
    );
}
