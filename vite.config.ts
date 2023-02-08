/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";

// component root dir
const componentsDir = resolve(__dirname, "components");

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      dts({
        // 声明文件输出目录
        outputDir: "es",
        // 入口文件的跟路径
        entryRoot: componentsDir,
      }),
      dts({
        outputDir: "lib",
        entryRoot: componentsDir,
      }),
    ],
    test: {
      environment: "happy-dom",
    },
    build: {
      minify: false,
      lib: {
        name: "bobo-style",
        // 入口文件
        entry: resolve(componentsDir, "index.ts"),
      },
      rollupOptions: {
        external: ["vue"],
        output: [
          {
            format: "es",
            entryFileNames: "[name].mjs",
            // 打包目录和文件目录对应
            preserveModules: true,
            // 入口文件的根路径
            preserveModulesRoot: componentsDir,
            // 打包输出目录
            dir: "es",
          },
          {
            format: "cjs",
            entryFileNames: "[name].cjs",
            preserveModules: true,
            preserveModulesRoot: componentsDir,
            dir: "lib",
          },
        ],
      },
    },
  };
});
