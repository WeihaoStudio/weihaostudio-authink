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
                        >
                            {isPasswordVisible ? "隐藏" : "显示"}
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
                            记住我
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
                >
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
