import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { authInkAssets } from "./assets";

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template } = props;
    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        auth,
        registrationDisabled,
        messagesPerField
    } = kcContext;
    const { msg, msgStr } = i18n;
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
            headerNode={msg("loginAccountTitle")}
            displayMessage={!hasCredentialError}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <p>
                    {msg("noAccount")} <a href={url.registrationUrl}>{msg("doRegister")}</a>
                </p>
            }
            socialProvidersNode={
                providers.length > 0 ? (
                    <section className="authink-social" aria-labelledby="authink-social-title">
                        <div className="authink-divider">
                            <span id="authink-social-title">或使用</span>
                        </div>
                        <div className="authink-social__list">
                            {providers.map(provider => {
                                const normalizedProvider = `${provider.alias} ${provider.providerId}`.toLowerCase();
                                const iconUrl = normalizedProvider.includes("google")
                                    ? authInkAssets.googleIconUrl
                                    : normalizedProvider.includes("github")
                                      ? authInkAssets.githubIconUrl
                                      : undefined;

                                return (
                                    <a
                                        className="authink-social__button"
                                        href={provider.loginUrl}
                                        key={provider.alias}
                                    >
                                        {iconUrl !== undefined && (
                                            <img src={iconUrl} alt="" aria-hidden="true" />
                                        )}
                                        <span>使用 {provider.displayName} 登录</span>
                                    </a>
                                );
                            })}
                        </div>
                    </section>
                ) : null
            }
        >
            {realm.password && (
                <form
                    className="authink-form"
                    data-authink-login
                    action={url.loginAction}
                    method="post"
                    onSubmit={() => setIsSubmitting(true)}
                >
                    {!usernameHidden && (
                        <div className="authink-field">
                            <label htmlFor="username">
                                {!realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : realm.registrationEmailAsUsername
                                      ? msg("email")
                                      : msg("usernameOrEmail")}
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                defaultValue={login.username ?? ""}
                                autoComplete="username"
                                autoFocus
                                aria-invalid={hasCredentialError}
                                aria-describedby={hasCredentialError ? "authink-credential-error" : undefined}
                            />
                        </div>
                    )}

                    <div className="authink-field">
                        <label htmlFor="password">{msg("password")}</label>
                        <div className="authink-password">
                            <input
                                id="password"
                                name="password"
                                type={isPasswordVisible ? "text" : "password"}
                                autoComplete="current-password"
                                aria-invalid={hasCredentialError}
                                aria-describedby={hasCredentialError ? "authink-credential-error" : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(value => !value)}
                                aria-controls="password"
                                aria-label={isPasswordVisible ? msgStr("hidePassword") : msgStr("showPassword")}
                            >
                                {isPasswordVisible ? "隐藏" : "显示"}
                            </button>
                        </div>
                    </div>

                    {credentialError !== undefined && (
                        <div
                            id="authink-credential-error"
                            className="authink-field-error"
                            role="alert"
                            dangerouslySetInnerHTML={{ __html: kcSanitize(credentialError) }}
                        />
                    )}

                    <div className="authink-options">
                        {realm.rememberMe && !usernameHidden ? (
                            <label className="authink-checkbox">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    defaultChecked={Boolean(login.rememberMe)}
                                />
                                <span>{msg("rememberMe")}</span>
                            </label>
                        ) : (
                            <span />
                        )}
                        {realm.resetPasswordAllowed && (
                            <a href={url.loginResetCredentialsUrl}>{msg("doForgotPassword")}</a>
                        )}
                    </div>

                    <input
                        type="hidden"
                        name="credentialId"
                        value={auth.selectedCredential}
                    />
                    <button
                        className="authink-submit"
                        name="login"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        <span>{isSubmitting ? "正在验证…" : msg("doLogIn")}</span>
                    </button>
                </form>
            )}
        </Template>
    );
}
