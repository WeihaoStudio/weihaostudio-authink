import { useRef, useState } from "react";
import { InkLoading } from "./components/InkLoading";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

const OTP_LENGTH = 6;

export default function LoginOtp(
    props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template } = props;
    const { otpLogin, url, messagesPerField, auth } = kcContext;
    const { msgStr } = i18n;
    const [digits, setDigits] = useState(() => Array<string>(OTP_LENGTH).fill(""));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const hasError = messagesPerField.existsError("totp");

    const updateDigits = (startIndex: number, value: string) => {
        const incoming = value.replace(/\D/g, "").slice(0, OTP_LENGTH - startIndex);
        if (incoming.length === 0) {
            setDigits(current => current.map((digit, index) => index === startIndex ? "" : digit));
            return;
        }

        setDigits(current => {
            const next = [...current];
            incoming.split("").forEach((digit, offset) => {
                next[startIndex + offset] = digit;
            });
            return next;
        });

        inputsRef.current[Math.min(startIndex + incoming.length, OTP_LENGTH - 1)]?.focus();
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode="二步验证"
            displayMessage={!hasError}
        >
            <form
                id="kc-otp-login-form"
                className="form-stack"
                data-authink-otp
                action={url.loginAction}
                method="post"
                onSubmit={() => setIsSubmitting(true)}
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className="field">
                        <label htmlFor="selectedCredentialId">验证器</label>
                        <select
                            id="selectedCredentialId"
                            name="selectedCredentialId"
                            defaultValue={otpLogin.selectedCredentialId}
                        >
                            {otpLogin.userOtpCredentials.map(credential => (
                                <option key={credential.id} value={credential.id}>
                                    {credential.userLabel}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="otp" role="group" aria-label="六位动态验证码">
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            ref={element => {
                                inputsRef.current[index] = element;
                            }}
                            value={digit}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            autoComplete={index === 0 ? "one-time-code" : "off"}
                            autoFocus={index === 0}
                            required
                            aria-label={`第 ${index + 1} 位`}
                            aria-invalid={hasError}
                            onChange={event => updateDigits(index, event.target.value)}
                            onPaste={event => {
                                event.preventDefault();
                                updateDigits(index, event.clipboardData.getData("text"));
                            }}
                            onKeyDown={event => {
                                if (event.key === "Backspace" && digits[index] === "" && index > 0) {
                                    inputsRef.current[index - 1]?.focus();
                                }
                                if (event.key === "ArrowLeft" && index > 0) {
                                    inputsRef.current[index - 1]?.focus();
                                }
                                if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
                                    inputsRef.current[index + 1]?.focus();
                                }
                            }}
                        />
                    ))}
                </div>

                <input type="hidden" name="otp" value={digits.join("")} />

                {hasError && (
                    <div
                        id="input-error-otp-code"
                        className="field-error"
                        role="alert"
                        dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("totp")) }}
                    />
                )}

                <button
                    className="button button--primary"
                    name="login"
                    type="submit"
                    disabled={isSubmitting || digits.some(digit => digit === "")}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting && <InkLoading size={20} announce={false} />}
                    <span>{isSubmitting ? "正在验证…" : "验证"}</span>
                </button>

                {auth?.showTryAnotherWayLink && (
                    <button
                        className="button button--secondary"
                        name="tryAnotherWay"
                        value="on"
                        type="submit"
                        formNoValidate
                    >
                        使用其他方式登录
                    </button>
                )}

                <a className="auth-card__back-link" href={url.loginRestartFlowUrl}>
                    {msgStr("backToLogin") === "backToLogin" ? "返回登录" : msgStr("backToLogin")}
                </a>
            </form>
        </Template>
    );
}
