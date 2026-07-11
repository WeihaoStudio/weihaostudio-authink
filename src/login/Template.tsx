import { useEffect, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { authInkAssets } from "./assets";
import "./authink.tokens.css";
import "./authink.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, children, displayMessage = true, documentTitle, headerNode } = props;
    const { message } = kcContext;
    const { msgStr } = i18n;
    const [theme, setTheme] = useState<"light" | "dark">(
        kcContext.pageId === "login-otp.ftl" ? "dark" : "light"
    );
    const isOtpPage = kcContext.pageId === "login-otp.ftl";

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    return (
        <main
            className="auth-browser auth-browser--production"
            data-theme={theme}
            style={{
                "--auth-light-background": `url(${authInkAssets.backgroundLightUrl})`,
                "--auth-dark-background": `url(${authInkAssets.backgroundDarkUrl})`
            } as React.CSSProperties}
        >
            <button
                type="button"
                className="authink-theme-toggle"
                aria-label={theme === "light" ? "切换到夜间主题" : "切换到日间主题"}
                aria-pressed={theme === "dark"}
                onClick={() => setTheme(current => current === "light" ? "dark" : "light")}
            >
                <span aria-hidden="true">{theme === "light" ? "夜" : "昼"}</span>
            </button>
            <div className="auth-shell">
                <aside className="visual" aria-label="WeihaoStudio 水墨山景">
                    <div className="visual__quote" aria-live="polite">
                        <p>{theme === "dark" ? "月色入山。" : "山水有归处。"}</p>
                    </div>
                </aside>
                <div className="panel">
                    <section className="auth-card" aria-labelledby="authink-title">
                        <img
                            className="auth-card__logo"
                            src={theme === "dark" ? authInkAssets.logoWhiteUrl : authInkAssets.logoInkUrl}
                            alt="WeihaoStudio"
                        />
                        <h3 id="authink-title">{headerNode}</h3>
                        <p className="auth-card__description">
                            {isOtpPage
                                ? "请输入身份验证器 App 中的 6 位动态验证码。"
                                : "使用您的账号安全登录。"}
                        </p>
                        {displayMessage && message !== undefined && (
                            <div
                                className="auth-alert"
                                role={message.type === "error" ? "alert" : "status"}
                                dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                            />
                        )}
                        {children}
                    </section>
                </div>
            </div>
        </main>
    );
}
