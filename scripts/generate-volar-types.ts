import path from "path";
import process from "process";
import fs from "fs-extra";
import { components as globalComponents } from "../components";

const TYPE_ROOT = process.cwd();
const DTS_FILENAME = "volar.d.ts";

const excludeComponents: string[] = [];

async function generateVolarTypes() {
  const components: Record<string, string> = {};
  globalComponents.forEach((component) => {
    const key = component.name;
    const entry = `typeof import('bobo-style')['${key}']`;
    if (!excludeComponents.includes(key)) {
      components[key] = entry;
    }
  });

  const originDTS = fs.existsSync(path.resolve(TYPE_ROOT, DTS_FILENAME))
    ? await fs.readFile(path.resolve(TYPE_ROOT, DTS_FILENAME), "utf-8")
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
    await fs.writeFile(path.resolve(TYPE_ROOT, DTS_FILENAME), code, "utf-8");
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
