import { describe, expect, it } from "vitest";
import type { App } from "vue";
import { defineComponent } from "vue";
import { withInstall } from "./withInstall";

interface Component {
  install?: () => void;
}

function generateApp() {
  const app = {
    names: <string[]>[],
    use(com: Component) {
      com.install?.();
    },
    component(name: string, _com: Component) {
      this.names.push(name);
    },
    get() {
      return this.names;
    },
  };
  return app;
}

const componentA = defineComponent({
  name: "ButtonGroup",
});
const componentB = defineComponent({
  /* eslint-disable vue/component-definition-name-casing */
  name: "button-group",
});

describe("withInstall", () => {
  it("test component name registry", () => {
    const components = [componentA, componentB];
    const app = generateApp();
    const install = withInstall(components);
    install(app as unknown as App);
    expect(app.names).toEqual([
      "ButtonGroup",
      "button-group",
      "ButtonGroup",
      "button-group",
    ]);
  });
});
