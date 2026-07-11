import { useEffect, useState, type CSSProperties } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { authInkAssets } from "./assets";
import "./authink.tokens.css";
import "./authink.css";

type AuthInkStyle = CSSProperties & {
    "--authink-bg-light": string;
    "--authink-bg-dark": string;
};

export default function Template(
    props: TemplateProps<KcContext, I18n>
) {
    const {
        kcContext,
        i18n,
        children,
        displayInfo = false,
        displayMessage = true,
        headerNode,
        socialProvidersNode,
        infoNode,
        documentTitle
    } = props;
    const { message } = kcContext;
    const { msgStr } = i18n;
    const [theme, setTheme] = useState<"light" | "dark">(() =>
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    );

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, [documentTitle, kcContext.realm.displayName, msgStr]);

    const style: AuthInkStyle = {
        "--authink-bg-light": `url(${authInkAssets.backgroundLightUrl})`,
        "--authink-bg-dark": `url(${authInkAssets.backgroundDarkUrl})`
    };

    return (
        <main className="authink-shell" data-theme={theme} style={style}>
            <section className="authink-visual" aria-label="WeihaoStudio 水墨山景">
                <img
                    className="authink-visual__logo"
                    src={theme === "dark" ? authInkAssets.logoWhiteUrl : authInkAssets.logoInkUrl}
                    alt="WeihaoStudio"
                />
                <div className="authink-visual__caption" aria-hidden="true">
                    <span>墨境入微</span>
                    <span>守护每一次可信连接</span>
                </div>
            </section>

            <section className="authink-panel" aria-labelledby="authink-title">
                <button
                    className="authink-theme-toggle"
                    type="button"
                    onClick={() => setTheme(value => (value === "light" ? "dark" : "light"))}
                    aria-label={theme === "light" ? "切换到深色主题" : "切换到浅色主题"}
                >
                    <span aria-hidden="true">{theme === "light" ? "夜" : "昼"}</span>
                </button>

                <div className="authink-form-wrap">
                    <img
                        className="authink-panel__logo"
                        src={theme === "dark" ? authInkAssets.logoWhiteUrl : authInkAssets.logoInkUrl}
                        alt="WeihaoStudio"
                    />
                    <header className="authink-header">
                        <p className="authink-eyebrow">IDENTITY ACCESS</p>
                        <h1 id="authink-title">{headerNode}</h1>
                        <p>以可信身份，进入 WeihaoStudio 的数字空间。</p>
                    </header>

                    {displayMessage && message !== undefined && (
                        <div
                            className={`authink-alert authink-alert--${message.type}`}
                            role={message.type === "error" ? "alert" : "status"}
                            dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                        />
                    )}

                    {children}
                    {socialProvidersNode}
                    {displayInfo && <div className="authink-info">{infoNode}</div>}

                    <footer className="authink-footer">
                        <span>© WeihaoStudio</span>
                        <span aria-hidden="true">·</span>
                        <span>安全认证服务</span>
                    </footer>
                </div>
            </section>
        </main>
    );
}
