import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve("src/email", path), "utf8");

describe("AuthInk native email theme", () => {
    it("uses a UTF-8, email-client-safe shared layout", () => {
        const template = read("html/template.ftl");
        expect(template).toContain('<html lang="zh-CN">');
        expect(template).toContain('charset="UTF-8"');
        expect(template).toContain('role="presentation"');
        expect(template).toContain("WeihaoStudio");
        expect(template).toContain("身份与安全通知");
        expect(template).not.toContain("<script");
        expect(template).not.toContain("<canvas");
    });

    it.each([
        ["html/email-verification.ftl", "确认你的邮箱"],
        ["html/password-reset.ftl", "重置你的密码"],
        ["html/executeActions.ftl", "完成账户安全操作"],
        ["html/identity-provider-link.ftl", "确认账户关联"]
    ])("keeps the Keycloak action link in %s", (path, title) => {
        const source = read(path);
        expect(source).toContain(title);
        expect(source).toContain('href="${link}"');
        expect(source).toContain("linkExpirationFormatter(linkExpiration)");
        expect(source).toContain("如非你本人操作");
    });

    it.each([
        "text/email-verification.ftl",
        "text/password-reset.ftl",
        "text/executeActions.ftl",
        "text/identity-provider-link.ftl"
    ])("provides a plain-text alternative in %s", path => {
        const source = read(path);
        expect(source).toContain('${link}');
        expect(source).toContain("如非你本人操作");
    });

    it("uses concise UTF-8 Chinese subjects", () => {
        const messages = read("messages/messages_zh_CN.properties");
        expect(messages).toContain("emailVerificationSubject=确认你的邮箱");
        expect(messages).toContain("passwordResetSubject=重置你的密码");
        expect(messages).toContain("executeActionsSubject=请完成账户安全操作");
        expect(messages).toContain("identityProviderLinkSubject=确认账户关联");
    });
});
