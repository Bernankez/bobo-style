import { withInstall } from "@bobo-style/utils";
import { Button } from "./button";
import { Card } from "./card";

const components = [Button, Card];

export { Button, Card };

export default withInstall(components);
