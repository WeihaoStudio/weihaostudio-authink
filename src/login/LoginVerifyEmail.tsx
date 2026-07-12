import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

export default function LoginVerifyEmail(
    props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, user } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode="确认你的邮箱"
        >
            <div className="authink-flow" data-authink-verify-email>
                <p className="authink-flow__copy">
                    {user?.email ? (
                        <>
                            验证邮件已发送至
                            <strong className="authink-flow__address">{user.email}</strong>
                            ，请点击邮件中的链接继续。
                        </>
                    ) : (
                        "请前往你的邮箱完成验证。"
                    )}
                </p>
                <div className="authink-flow__actions">
                    <a className="button button--primary" href={url.loginAction}>
                        <span>重新发送验证邮件</span>
                    </a>
                    <a className="auth-card__back-link" href={url.loginUrl}>
                        返回登录
                    </a>
                </div>
            </div>
        </Template>
    );
}
