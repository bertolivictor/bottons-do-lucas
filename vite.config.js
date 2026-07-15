import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ command, mode }) => {
  const isApp = mode === "capacitor"; // build do app Android (Capacitor)
  return {
    // Base relativa no build: funciona em qualquer subpasta do GitHub Pages
    // (nao precisa configurar o nome do repositorio) e tambem no app Android.
    base: command === "build" ? "./" : "/",
    plugins: [
      react(),
      // Service worker so na versao web (no app nativo nao faz sentido).
      ...(isApp
        ? []
        : [
            VitePWA({
              registerType: "autoUpdate",
              injectRegister: "auto",
              includeAssets: ["favicon.ico", "apple-touch-icon.png"],
              manifest: {
                name: "Bottons do Lucas",
                short_name: "Bottons",
                description: "Custo, precos e vendas dos Bottons do Lucas.",
                theme_color: "#0f0d0c",
                background_color: "#0f0d0c",
                display: "standalone",
                orientation: "portrait",
                start_url: ".",
                scope: ".",
                icons: [
                  { src: "icon-192.png", sizes: "192x192", type: "image/png" },
                  { src: "icon-512.png", sizes: "512x512", type: "image/png" },
                  { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
                ],
              },
              workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
                navigateFallback: "index.html",
                cleanupOutdatedCaches: true,
              },
            }),
          ]),
    ],
  };
});
