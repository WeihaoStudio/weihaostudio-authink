import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

export default function Info(
    props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const {
        messageHeader,
        message,
        requiredActions,
        skipLink,
        pageRedirectUri,
        actionUri,
        client
    } = kcContext;
    const continuation = pageRedirectUri ?? actionUri ?? client.baseUrl;
    const continuationLabel = pageRedirectUri || client.baseUrl ? "返回应用" : "继续";

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={messageHeader ?? "操作完成"}
        >
            <div className="authink-flow" data-authink-info>
                <p
                    className="authink-flow__copy"
                    dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }}
                />
                {requiredActions && requiredActions.length > 0 && (
                    <p className="authink-flow__meta">
                        仍需完成：{requiredActions.map(action => i18n.advancedMsgStr(`requiredAction.${action}`)).join("、")}
                    </p>
                )}
                {!skipLink && continuation && (
                    <a className="button button--primary" href={continuation}>
                        <span>{continuationLabel}</span>
                    </a>
                )}
            </div>
        </Template>
    );
}
