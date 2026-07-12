import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve("src/email", path), "utf8");

describe("AuthInk native email theme", () => {
    it("uses a UTF-8, email-client-safe shared layout", () => {
        const template = read("html/template.ftl");
        expect(template).toContain('<#macro emailLayout title="">');
        expect(template).toContain('<html>');
        expect(template).not.toContain('lang="zh-CN"');
        expect(template).toContain('charset="UTF-8"');
        expect(template).toContain('role="presentation"');
        expect(template).toContain("WeihaoStudio");
        expect(template).toContain('msg("authinkEmailKicker")');
        expect(template).toContain('msg("authinkEmailSafety")');
        expect(template).not.toContain("<script");
        expect(template).not.toContain("<canvas");
    });

    it("keeps the shared layout compatible with native no-argument callers", () => {
        const template = read("html/template.ftl");
        expect(template).toContain('<#macro emailLayout title="">');

        const nativeCallers = [
            "html/email-test.ftl",
            "html/email-update-confirmation.ftl",
            "html/email-verification-with-code.ftl",
            "html/org-invite.ftl",
            "html/event-login_error.ftl",
            "html/event-remove_credential.ftl",
            "html/event-remove_totp.ftl",
            "html/event-update_credential.ftl",
            "html/event-update_password.ftl",
            "html/event-update_totp.ftl",
            "html/event-user_disabled_by_temporary_lockout.ftl",
            "html/event-user_disabled_by_permanent_lockout.ftl"
        ];

        for (const path of nativeCallers) {
            expect(read(path)).toContain("<@layout.emailLayout>");
        }
    });

    it.each([
        ["html/email-verification.ftl", "emailVerificationSubject", "emailVerificationBodyHtml"],
        ["html/password-reset.ftl", "passwordResetSubject", "passwordResetBodyHtml"],
        ["html/executeActions.ftl", "executeActionsSubject", "executeActionsBodyHtml"],
        ["html/identity-provider-link.ftl", "identityProviderLinkSubject", "identityProviderLinkBodyHtml"]
    ])("localizes and sanitizes the Keycloak action in %s", (path, subjectKey, bodyKey) => {
        const source = read(path);
        expect(source).toContain(`title=msg("${subjectKey}")`);
        expect(source).toContain(`kcSanitize(msg("${bodyKey}"`);
        expect(source).toContain("?no_esc");
        expect(source).not.toContain('href="${link}"');
    });

    it.each([
        "text/email-verification.ftl",
        "text/password-reset.ftl",
        "text/executeActions.ftl",
        "text/identity-provider-link.ftl"
    ])("provides a localized plain-text alternative in %s", path => {
        const source = read(path);
        expect(source).toContain('${msg("');
        expect(source).not.toContain("如非你本人操作");
    });

    it("keeps execute-actions list directives balanced in HTML and text", () => {
        for (const path of [
            "html/executeActions.ftl",
            "text/executeActions.ftl"
        ]) {
            const source = read(path);
            expect(source).toContain("<#sep>, </#sep></#items>");
            expect(source).not.toContain("<#sep>, </#items>");
        }
    });

    it("uses concise UTF-8 Chinese subjects", () => {
        const messages = read("messages/messages_zh_CN.properties");
        expect(messages).toContain("emailVerificationSubject=确认你的邮箱");
        expect(messages).toContain("passwordResetSubject=重置你的密码");
        expect(messages).toContain("executeActionsSubject=请完成账户安全操作");
        expect(messages).toContain("identityProviderLinkSubject=确认账户关联");
    });
});

it("renders the approved landscape header and a primary CTA in every action email", () => {
    const template = read("html/template.ftl");
    expect(template).toContain('${url.resourcesPath}/img/authink-email-landscape.webp');
    expect(template).toContain('<#macro primaryAction link label>');
    expect(template).toContain('min-height:48px');

    for (const path of [
        "html/email-verification.ftl",
        "html/password-reset.ftl",
        "html/executeActions.ftl",
        "html/identity-provider-link.ftl"
    ]) {
        expect(read(path)).toContain("<@layout.primaryAction link=link");
    }
});

it("includes required actions in the Chinese execute-actions alternatives", () => {
    const messages = read("messages/messages_zh_CN.properties");
    const executeActionsBody = messages
        .split("\n")
        .find(line => line.startsWith("executeActionsBody="));
    const executeActionsBodyHtml = messages
        .split("\n")
        .find(line => line.startsWith("executeActionsBodyHtml="));

    expect(executeActionsBody).toContain("{3}");
    expect(executeActionsBodyHtml).toContain("{3}");
});
