import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"]
    },
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            themeName: "weihaostudio-authink",
            accountThemeImplementation: "Single-Page",
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": "weihaostudio-authink.jar"
            }
        })
    ]
});
