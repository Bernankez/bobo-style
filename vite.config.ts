/// <reference types="vitest" />
import { resolve } from "path";
// import glob from "fast-glob";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

const componentsDir = resolve(__dirname, "components");

// https://vitejs.dev/config/
export default defineConfig(async () => {
  // const input = await glob("components/**/*.{ts,tsx,vue}", {
  //   cwd: __dirname,
  //   absolute: true,
  //   onlyFiles: true,
  //   ignore: [],
  // });

  return {
    plugins: [vue(), vueJsx(), dts({
      copyDtsFiles: false,
    })],
    test: {
      environment: "happy-dom",
    },
    build: {
      minify: false,
      lib: {
        entry: resolve(componentsDir, "index.ts"),
        name: "bobo-style",
        fileName: module => `[name].${module === "es" ? "mjs" : "js"}`,
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        // input,
        external: ["vue"],
        output: {
          inlineDynamicImports: false,
          preserveModules: true,
          // preserveModulesRoot: componentsDir,
          globals: {
            vue: "Vue",
          },
        },
      },
    },
  };
});
