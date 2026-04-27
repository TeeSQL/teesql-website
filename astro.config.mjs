import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

// Static-only site → Cloudflare Workers Assets via wrangler.jsonc.
// `astro build` writes to ./dist by default; override to ./out so the
// existing wrangler.jsonc (which points at ./out) keeps working
// without churn. CF's Workers Builds picks up the same `out/` dir
// regardless of which framework produced it.
export default defineConfig({
  outDir: "./out",
  output: "static",
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
