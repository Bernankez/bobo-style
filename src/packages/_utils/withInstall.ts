import type { App } from "vue";
import { camelCase, kebabCase, upperFirst } from "lodash-es";

export function withInstall(components: any[] = []) {
  return function install(app: App) {
    components.forEach((component) => {
      if (typeof component.install === "function") {
        app.use(component);
      } else {
        app.component(upperFirst(camelCase(component.name)), component); // ButtonGroup
        app.component(kebabCase(component.name), component); // button-group

        if (typeof component.installDirective === "function") {
          component.installDirective(app);
        }
      }
    });
  };
}
