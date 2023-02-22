import { presetBobo } from "@bobo-style/preset";
import { defineConfig, presetUno, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetBobo()],
  transformers: [transformerDirectives()],
});
