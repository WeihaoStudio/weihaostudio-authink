import JSZip from "jszip";

const NORMALIZED_DATE = new Date("1980-01-01T00:00:00.000Z");

export async function normalizeJarBuffer(source) {
    const input = await JSZip.loadAsync(source, { createFolders: false });
    const output = new JSZip();

    for (const name of Object.keys(input.files).sort()) {
        const entry = input.files[name];
        const options = {
            date: NORMALIZED_DATE,
            dir: entry.dir,
            createFolders: false,
            unixPermissions: entry.unixPermissions ?? (entry.dir ? 0o40755 : 0o100644)
        };

        if (entry.dir) {
            output.file(name, null, options);
        } else {
            output.file(name, await entry.async("nodebuffer"), options);
        }
    }

    return output.generateAsync({
        type: "nodebuffer",
        platform: "UNIX",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
        streamFiles: false
    });
}
