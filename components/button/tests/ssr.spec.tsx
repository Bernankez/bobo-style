/**
 * @vitest-environment node
 */

import { describe, expect, it } from "vitest";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { Button } from "..";

describe("SSR for Alert", () => {
  it("render", async () => {
    try {
      await renderToString(createSSRApp(() => <Button></Button>));
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
