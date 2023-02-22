import path from "node:path";
import process from "node:process";
import fs from "fs-extra";
import * as globalComponents from "../packages/components/components";

const TYPE_ROOT = process.cwd();
const DTS_FILEPATH = "./packages/bobo-style/volar.d.ts";

const excludeComponents: string[] = [];

async function generateVolarTypes() {
  const components: Record<string, string> = {};
  Object.keys(globalComponents).forEach((key) => {
    if (key === "default") { return; }
    const entry = `typeof import('bobo-style')['${key}']`;
    if (!excludeComponents.includes(key)) {
      components[key] = entry;
    }
  });

  const originDTS = fs.existsSync(path.resolve(TYPE_ROOT, DTS_FILEPATH))
    ? await fs.readFile(path.resolve(TYPE_ROOT, DTS_FILEPATH), "utf-8")
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
    await fs.writeFile(path.resolve(TYPE_ROOT, DTS_FILEPATH), code, "utf-8");
  }
}
generateVolarTypes();

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
