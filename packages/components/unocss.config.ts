import { defineConfig, presetUno, transformerDirectives } from "unocss";
import { presetBobo } from "@bobo-style/preset";

export default defineConfig({
  presets: [presetUno(), presetBobo()],
  transformers: [transformerDirectives()],
});
