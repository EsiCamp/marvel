import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  ssr: true,

  nitro: {
    preset: "node-server",
  },

  runtimeConfig: {
    marvelPrivateKey:
      process.env.MARVEL_PRIVATE_KEY ||
      "d6c577f1c0ca81f6bbba002efc8363140d8c6161",
    public: {
      marvelPublicKey:
        process.env.MARVEL_PUBLIC_KEY || "d8c360932c6089f76d4e67868fdbed47",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
