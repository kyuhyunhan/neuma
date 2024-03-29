import { defineConfig } from "vite";
import { resolve } from "pathe";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: "dist/types",
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "Neuma",
      // the proper extensions will be added
      fileName: "neuma",
      formats: ["es", "cjs", "umd", "iife"],
    },
  },
});
