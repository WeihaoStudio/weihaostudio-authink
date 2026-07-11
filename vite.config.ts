import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"]
    },
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "none"
        })
    ]
});
