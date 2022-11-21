import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

import manifest from "./manifest.json";
import packageJson from "./package.json";

const {
  $schema: _schema,
  version: _version,
  name,
  ...manifestWithoutSchemaAndVersion
} = manifest;

const isDev = process.env.NODE_ENV === "development";
const nameSuffix = !isDev ? "" : " (Dev)";
const finalManifest = {
  ...manifestWithoutSchemaAndVersion,
  name: `${name}${nameSuffix}`,
  version: packageJson.version,
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  plugins: [
    react(),
    crx({
      manifest: finalManifest,
    }),
  ],
});
