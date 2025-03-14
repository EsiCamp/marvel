import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  ssr: true,

  nitro: {
    preset: "node-server",
    storage: {
      data: {
        driver: "memory",
      },
    },
  },

  routeRules: {
    "/": { swr: 300 },
    "/character/**": { swr: 600 },
  },

  runtimeConfig: {
    marvelPrivateKey:
      process.env.MARVEL_PRIVATE_KEY ||
      "d6c577f1c0ca81f6bbba002efc8363140d8c6161",
    public: {
      marvelPublicKey:
        process.env.MARVEL_PUBLIC_KEY || "d8c360932c6089f76d4e67868fdbed47",
      marvelBaseUrl:
        process.env.MARVEL_BASE_URL || "https://gateway.marvel.com/v1/public",
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "dns-prefetch", href: "https://gateway.marvel.com" },
        { rel: "preconnect", href: "https://gateway.marvel.com" },
      ],
    },
    keepalive: true,
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
});
