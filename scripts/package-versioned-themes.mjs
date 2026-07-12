import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeJarBuffer } from "./deterministic-jar.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(projectRoot, "dist_keycloak");
const sourceJar = resolve(distDir, "weihaostudio-authink.jar");
const versionedDir = resolve(distDir, "versioned");
const targets = ["21.0.2", "26.0.0"];

await mkdir(versionedDir, { recursive: true });
const source = await normalizeJarBuffer(await readFile(sourceJar));
const digest = createHash("sha256").update(source).digest("hex");
const sums = [];

for (const version of targets) {
    const filename = `weihaostudio-authink-keycloak-${version}.jar`;
    await writeFile(resolve(versionedDir, filename), source);
    sums.push(`${digest}  dist_keycloak/versioned/${filename}`);
}

await writeFile(resolve(versionedDir, "SHA256SUMS"), `${sums.join("\n")}\n`);
await writeFile(
    resolve(versionedDir, "BUILDINFO.txt"),
    [
        "WeihaoStudio AuthInk Keycloak Themes",
        `Built with: Keycloakify ${process.env.npm_package_dependencies_keycloakify ?? "11.15.11"}`,
        "",
        "Homelab runtime inventory:",
        "- keycloak-server-1: Keycloak 21.0.2, Java 17",
        "- keycloak-test-server-1: Keycloak 26.0.0, Java 21",
        "",
        "Included theme types: Login, Account, Email, Admin.",
        "KC26 test is the validated deployment target for all included theme types.",
        "KC21 production compatibility for Account, Email and Admin remains gated by a separate isolated test.",
        "The version-labelled JARs are intentionally byte-identical and normalized for reproducible packaging of the same source JAR.",
        ""
    ].join("\n")
);

console.log(`Packaged ${targets.length} version-labelled theme JARs (${digest}).`);
