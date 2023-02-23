import { resolve } from "node:path";
import { defineBuildConfig } from "unbuild";
import { copyFileSync } from "fs-extra";

const stylePath = resolve(__dirname, "../components/es/style.css");

export default defineBuildConfig({
  entries: [
    "./index",
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  hooks: {
    "rollup:done": () => {
      copyFileSync(stylePath, resolve(__dirname, "./dist/style.css"));
    },
  },
});
