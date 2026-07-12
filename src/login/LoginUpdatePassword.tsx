import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

export default function LoginUpdatePassword(
    props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, messagesPerField, isAppInitiatedAction } = kcContext;
    const hasError = messagesPerField.existsError("password", "password-confirm");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode="设置新密码"
        >
            <form
                className="authink-flow"
                action={url.loginAction}
                method="post"
                data-authink-update-password
            >
                <PasswordField
                    id="password-new"
                    name="password-new"
                    label="新密码"
                    autoFocus
                    invalid={hasError}
                    error={messagesPerField.existsError("password") ? messagesPerField.get("password") : undefined}
                />
                <PasswordField
                    id="password-confirm"
                    name="password-confirm"
                    label="确认新密码"
                    invalid={hasError}
                    error={messagesPerField.existsError("password-confirm") ? messagesPerField.get("password-confirm") : undefined}
                />
                <label className="check-row">
                    <input id="logout-sessions" name="logout-sessions" type="checkbox" value="on" />
                    <span className="check-row__box" aria-hidden="true" />
                    <span>退出其他设备</span>
                </label>
                <div className="authink-flow__actions">
                    <button className="button button--primary" type="submit">
                        <span>保存新密码</span>
                    </button>
                    {isAppInitiatedAction && (
                        <button
                            className="button button--secondary"
                            type="submit"
                            name="cancel-aia"
                            value="true"
                        >
                            取消
                        </button>
                    )}
                </div>
            </form>
        </Template>
    );
}

function PasswordField(props: {
    id: string;
    name: string;
    label: string;
    invalid: boolean;
    error?: string;
    autoFocus?: boolean;
}) {
    const { id, name, label, invalid, error, autoFocus } = props;
    const [visible, setVisible] = useState(false);
    const errorId = `${id}-error`;

    return (
        <div className="field">
            <label htmlFor={id}>{label}</label>
            <div className="password-field">
                <input
                    id={id}
                    name={name}
                    type={visible ? "text" : "password"}
                    autoFocus={autoFocus}
                    autoComplete="new-password"
                    aria-invalid={invalid}
                    aria-describedby={error ? errorId : undefined}
                />
                <button
                    className="password-toggle"
                    type="button"
                    aria-label={visible ? "隐藏密码" : "显示密码"}
                    aria-controls={id}
                    aria-pressed={visible}
                    onClick={() => setVisible(value => !value)}
                >
                    <EyeIcon hidden={visible} />
                </button>
            </div>
            {error && (
                <p
                    id={errorId}
                    className="field-error"
                    role="alert"
                    dangerouslySetInnerHTML={{ __html: kcSanitize(error) }}
                />
            )}
        </div>
    );
}

function EyeIcon(props: { hidden: boolean }) {
    return props.hidden ? (
        <svg className="password-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
            <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 5.4 9 5.4a14.7 14.7 0 0 1-2.1 2.8" />
            <path d="M6.6 6.6C4.3 8.1 3 10.4 3 10.4S6.5 16 12 16a9.8 9.8 0 0 0 3.4-.6" />
        </svg>
    ) : (
        <svg className="password-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    );
}
