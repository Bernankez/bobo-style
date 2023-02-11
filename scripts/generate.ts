import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { createConsole } from "@bernankez/utils";

const dir = typeof __dirname === "string" ? __dirname : dirname(fileURLToPath(import.meta.url));
const root = dirname(dir);
const { success, error } = createConsole("generate types ");

async function generate() {
  await Promise.all([
    execa("pnpm", ["tsxv", "--tsconfig", resolve(root, "./tsconfig.esbuild.json"), "./scripts/generate-volar-types.ts"], { cwd: root, stdio: "inherit" }),
    execa("pnpm", ["tsxv", "--tsconfig", resolve(root, "./tsconfig.esbuild.json"), "./scripts/generate-webstorm-types.ts"], { cwd: root, stdio: "inherit" }),
  ]).then(() => {
    success(`types generated in ${resolve(root, "./packages/bobo-style")}`);
    return true;
  }).catch((e) => {
    error("types generate failed", e);
    return false;
  });
}

generate();
