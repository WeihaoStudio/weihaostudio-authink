import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(projectRoot, "dist_keycloak");
const sourceJar = resolve(distDir, "weihaostudio-authink.jar");
const versionedDir = resolve(distDir, "versioned");
const targets = ["21.0.2", "26.0.0"];

await mkdir(versionedDir, { recursive: true });
const source = await readFile(sourceJar);
const digest = createHash("sha256").update(source).digest("hex");
const sums = [];

for (const version of targets) {
    const filename = `weihaostudio-authink-keycloak-${version}.jar`;
    await copyFile(sourceJar, resolve(versionedDir, filename));
    sums.push(`${digest}  dist_keycloak/versioned/${filename}`);
}

await writeFile(resolve(versionedDir, "SHA256SUMS"), `${sums.join("\n")}\n`);
await writeFile(
    resolve(versionedDir, "BUILDINFO.txt"),
    [
        "WeihaoStudio AuthInk Keycloak Login Theme",
        `Built with: Keycloakify ${process.env.npm_package_dependencies_keycloakify ?? "11.15.11"}`,
        "",
        "Targets verified on homelab 192.168.200.10:",
        "- keycloak-server-1: Keycloak 21.0.2, Java 17",
        "- keycloak-test-server-1: Keycloak 26.0.0, Java 21",
        "",
        "The project implements Login Theme only (accountThemeImplementation: none).",
        "Keycloakify classifies both targets in the all-other-versions compatibility range,",
        "so both version-labelled JARs are intentionally byte-identical.",
        ""
    ].join("\n")
);

console.log(`Packaged ${targets.length} version-labelled theme JARs (${digest}).`);
