import assert from "node:assert/strict";
import test from "node:test";
import JSZip from "jszip";
import { normalizeJarBuffer } from "./deterministic-jar.mjs";

async function makeJar(date) {
    const zip = new JSZip();
    zip.file("META-INF/MANIFEST.MF", "Manifest-Version: 1.0\n", { date });
    zip.file("theme/weihaostudio-authink/email/messages/messages_zh_CN.properties", "subject=验证邮箱\n", { date });
    return zip.generateAsync({ type: "nodebuffer", platform: "UNIX" });
}

test("normalizes JAR metadata so equivalent contents are byte-identical", async () => {
    const first = await normalizeJarBuffer(await makeJar(new Date("2026-07-12T10:00:00Z")));
    const second = await normalizeJarBuffer(await makeJar(new Date("2026-07-12T11:00:00Z")));

    assert.deepEqual(first, second);

    const normalized = await JSZip.loadAsync(first);
    assert.equal(
        await normalized.file("theme/weihaostudio-authink/email/messages/messages_zh_CN.properties").async("string"),
        "subject=验证邮箱\n"
    );
});

test("omits test source entries when normalizing a release JAR", async () => {
    const zip = new JSZip();
    zip.file("theme/weihaostudio-authink/email/email-theme.test.ts", "test source");
    zip.file("theme/weihaostudio-authink/email/template.ftl", "<html></html>");

    const release = await normalizeJarBuffer(await zip.generateAsync({ type: "nodebuffer" }), {
        excludeEntry: name => /\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/u.test(name)
    });
    const normalized = await JSZip.loadAsync(release);

    assert.equal(normalized.file("theme/weihaostudio-authink/email/email-theme.test.ts"), null);
    assert.equal(
        await normalized.file("theme/weihaostudio-authink/email/template.ftl").async("string"),
        "<html></html>"
    );
});
