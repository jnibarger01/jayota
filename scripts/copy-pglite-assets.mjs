#!/usr/bin/env node
/**
 * Nitro/Vercel bundles `@electric-sql/pglite` but does not copy its WASM/data
 * sidecars next to the emitted module. Local `vite preview` (no DATABASE_URL)
 * still boots PGLite, so those files must sit beside electric-sql__pglite.mjs.
 * Deployed Vercel uses Neon and never loads them.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "node_modules/@electric-sql/pglite/dist");
const destDir = join(root, ".vercel/output/functions/__server.func/_libs");

if (!existsSync(destDir)) {
  console.log("[pglite] no vercel function output — skip");
  process.exit(0);
}

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dest = join(to, name);
    const st = statSync(src);
    if (st.isDirectory()) {
      if (name === "contrib") continue;
      copyTree(src, dest);
    } else if (/\.(wasm|data)$/.test(name) || name === "pglite.data") {
      copyFileSync(src, dest);
      console.log(`[pglite] copied ${name}`);
    }
  }
}

copyTree(srcDir, destDir);
