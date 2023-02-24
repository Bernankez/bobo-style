import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { kebabCase } from "lodash-es";
import type { DefineComponent } from "vue";
import * as globalComponents from "../packages/components/components";
import { version } from "../package.json";

const dir = typeof __dirname === "string" ? __dirname : dirname(fileURLToPath(import.meta.url));
const root = dirname(dir);

const boboStyleDir = "./packages/bobo-style/web-types.json";
const componentsDir = "./packages/components/web-types.json";

interface Attribute {
  name: string;
  default: string;
  description: string;
  type?: string;
}

interface Event {
  name: string;
  description: string;
}

type Constructors =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor
  | ObjectConstructor
  | FunctionConstructor
  | DateConstructor;

generateWebstormTypes([boboStyleDir, componentsDir]);

function generateWebstormTypes(outputs: string[] = []) {
  if (outputs.length === 0) { return; }
  const vueComponents: any[] = [];

  const scaffold = {
    $schema:
      "https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json",
    framework: "vue",
    name: "bobo-style",
    version,
    contributions: {
      html: {
        "vue-components": vueComponents,
      },
    },
  };

  const ignoredPropNames: string[] = [];

  Object.keys(globalComponents).forEach((key) => {
    if (key === "default") { return; }
    const { props } = (globalComponents as unknown as Record<string, DefineComponent<{}, {}, any>>)[key];
    const slots: any[] = [];
    const attributes: Attribute[] = [];
    const events: Event[] = [];
    props && Object.entries(props).forEach(([propName, prop]) => {
      // if (propName.startsWith("internal")) { return; }
      if (ignoredPropNames.includes(propName)) { return; }
      if (propName.startsWith("on") && /[A-Z]/.test(propName[2])) {
        // is event
        events.push({
          name: kebabCase(propName.slice(2)),
          description: "-",
        });
      } else {
        const attribute: Attribute = {
          name: kebabCase(propName),
          default: "-",
          description: "-",
        };
        const type = prop ? getType(prop) : null;
        if (type !== null) {
          attribute.type = type;
        }
        // is attribute
        attributes.push(attribute);
      }
    });

    vueComponents.push({
      "name": key,
      "source": {
        symbol: key,
      },
      slots,
      attributes,
      props,
      "js/events": events,
    });
  });

  outputs.forEach((output) => {
    fs.writeFileSync(path.resolve(root, output), JSON.stringify(scaffold, null, 2), { encoding: "utf-8" });
  });
}

function getType(prop: any) {
  if (typeof prop !== "object" && typeof prop !== "function") {
    console.error(`invalid prop: ${prop}`);
    return null;
  }
  if ("type" in prop) {
    return _getType(prop.type);
  }
  if ("validator" in prop) {
    return null;
  }
  return _getType(prop);
}

function _getType(propType: Constructors[]) {
  if (Array.isArray(propType)) {
    const types = propType.map(mapType);
    if (types.includes(null)) {
      return null;
    }
    return types.join(" | ");
  }
  return mapType(propType);
}

function mapType(type: Constructors) {
  switch (type) {
    case String:
      return "string";
    case Number:
      return "number";
    case Boolean:
      return "boolean";
    case Array:
      return "Array";
    case Object:
      return "object";
    case Function:
      return "Function";
    case Date:
      return "Date";
  }
  console.error(`unknown type ${type}`);
  return null;
}
