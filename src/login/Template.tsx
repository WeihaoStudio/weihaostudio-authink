import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { authInkAssets } from "./assets";
import "./authink.tokens.css";
import "./authink.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, children, displayMessage = true, documentTitle } = props;
    const { message } = kcContext;
    const { msgStr } = i18n;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    return (
        <main
            className="auth-browser auth-browser--production"
            style={{
                "--auth-light-background": `url(${authInkAssets.backgroundLightUrl})`
            } as React.CSSProperties}
        >
            <div className="auth-shell">
                <aside className="visual" aria-label="WeihaoStudio 水墨山景" />
                <div className="panel">
                    <section className="auth-card" aria-labelledby="authink-title">
                        <img
                            className="auth-card__logo"
                            src={authInkAssets.logoInkUrl}
                            alt="WeihaoStudio"
                        />
                        <h3 id="authink-title">欢迎回来</h3>
                        <p className="auth-card__description">使用您的账号安全登录。</p>
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
