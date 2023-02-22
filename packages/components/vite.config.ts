import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import dts from "vite-plugin-dts";
import UnoCSS from "unocss/vite";

// component root dir
const componentsDir = __dirname;

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      // TODO #ref https://github.com/unocss/unocss/pull/2231 generate & move style.css
      UnoCSS(),
      dts({
        // 声明文件输出目录
        outputDir: "es",
        // 入口文件的跟路径
        entryRoot: componentsDir,
        // exclude auto inferred from tsconfig
        cleanVueFileName: true,
      }),
      dts({
        outputDir: "lib",
        entryRoot: componentsDir,
        cleanVueFileName: true,
      }),
    ],
    build: {
      minify: false,
      lib: {
        name: "bobo-style",
        // 入口文件
        entry: resolve(componentsDir, "index.ts"),
      },
      rollupOptions: {
        external: ["vue", "@bobo-style/utils"],
        output: [
          {
            format: "es",
            entryFileNames: chunkInfo =>
              `${chunkInfo.name.replace(/.vue$/, "")}.mjs`,
            // 打包目录和文件目录对应
            preserveModules: true,
            // 入口文件的根路径
            preserveModulesRoot: componentsDir,
            // 打包输出目录
            dir: "es",
          },
          {
            format: "cjs",
            entryFileNames: chunkInfo =>
              `${chunkInfo.name.replace(/.vue$/, "")}.cjs`,
            preserveModules: true,
            preserveModulesRoot: componentsDir,
            dir: "lib",
          },
        ],
      },
    },
  };
});
