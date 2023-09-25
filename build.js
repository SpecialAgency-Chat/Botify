// @ts-check
import { context } from "esbuild";
import dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

const isDev = process.env["NODE_ENV"] === "development";

/** @type {import("esbuild").BuildOptions} */
const baseOptions = {
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  target: "esnext",
  legalComments: "none",
  logLevel: "info",
  color: true,
  tsconfig: "tsconfig.json",
  sourcesContent: false,
  allowOverwrite: true,
  format: "esm"
};

const ctx1 = await context({
  ...baseOptions,
  entryPoints: ["src/server.ts"],
  outfile: "dist/server.js",
  platform: "browser",
  external: ["__STATIC_CONTENT_MANIFEST"]
});

const ctx2 = await context({
  ...baseOptions,
  entryPoints: ["src/tools/register.ts"],
  outfile: "dist/register.js",
  platform: "node",
  packages: "external"
});

await Promise.all([ctx1.rebuild(), ctx2.rebuild()]);

process.exit(0);