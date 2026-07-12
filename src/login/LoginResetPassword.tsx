import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, realm, auth, messagesPerField } = kcContext;
    const label = !realm.loginWithEmailAllowed
        ? "用户名"
        : realm.registrationEmailAsUsername
          ? "邮箱"
          : "用户名或邮箱";
    const hasError = messagesPerField.existsError("username");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode="找回密码"
        >
            <form
                className="authink-flow"
                action={url.loginAction}
                method="post"
                data-authink-reset-password
            >
                <p className="authink-flow__copy">
                    输入你的{label}，我们会发送后续操作指引。
                </p>
                <label className="field" htmlFor="username">
                    <span>{label}</span>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoFocus
                        autoComplete="username"
                        defaultValue={auth.attemptedUsername ?? ""}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? "input-error-username" : undefined}
                    />
                </label>
                {hasError && (
                    <p
                        id="input-error-username"
                        className="field-error"
                        role="alert"
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("username"))
                        }}
                    />
                )}
                <div className="authink-flow__actions">
                    <button className="button button--primary" type="submit">
                        <span>发送找回指引</span>
                    </button>
                    <a className="auth-card__back-link" href={url.loginUrl}>
                        返回登录
                    </a>
                </div>
            </form>
        </Template>
    );
}
