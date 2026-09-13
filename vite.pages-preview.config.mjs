/** Minimal preview config: serve build:pages static output under /jayota/ (no Nitro). */
import { defineConfig } from "vite";

export default defineConfig({
  base: "/jayota/",
  build: { outDir: ".vercel/output/static", emptyOutDir: false },
  preview: { host: "127.0.0.1", port: 4175, strictPort: true },
});
