import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import * as globalComponents from "../packages/components/components";

const dir = typeof __dirname === "string" ? __dirname : dirname(fileURLToPath(import.meta.url));
const root = dirname(dir);

const boboStyleDir = "./packages/bobo-style/volar.d.ts";
const componentsDir = "./packages/components/volar.d.ts";

generateVolarTypes([boboStyleDir, componentsDir]);

async function generateVolarTypes(outputs: string[] = []) {
  if (outputs.length === 0) { return; }
  const components: Record<string, string> = {};
  const excludeComponents: string[] = [];
  Object.keys(globalComponents).forEach((key) => {
    if (key === "default") { return; }
    const entry = `typeof import('bobo-style')['${key}']`;
    if (!excludeComponents.includes(key)) {
      components[key] = entry;
    }
  });

  const originDTS = fs.existsSync(path.resolve(root, outputs[0]))
    ? await fs.readFile(path.resolve(root, outputs[0]), "utf-8")
    : "";
  const originImports = parseComponentsDeclaration(originDTS);
  const lines = Object.entries({
    ...originImports,
    ...components,
  })
    .filter(([name]) => components[name])
    .map(([name, v]) => {
      if (!/^\w+$/.test(name)) {
        name = `'${name}'`;
      }
      return `${name}: ${v}`;
    });
  const code = `// Auto generated component declarations
declare module 'vue' {
  export interface GlobalComponents {
    ${lines.join("\n    ")}
  }
}
export {}
`;
  if (code !== originDTS) {
    await Promise.allSettled(outputs.map(output => fs.writeFile(path.resolve(root, output), code, "utf-8")));
  }
}

function parseComponentsDeclaration(code: string) {
  if (!code) {
    return {};
  }
  return Object.fromEntries(
    Array.from(code.matchAll(/(?<!\/\/)\s+\s+['"]?(.+?)['"]?:\s(.+?)\n/g)).map(
      i => [i[1], i[2]],
    ),
  );
}
