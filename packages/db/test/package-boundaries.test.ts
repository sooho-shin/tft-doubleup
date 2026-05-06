import { describe, expect, it } from "vitest";

import packageJson from "../package.json";

describe("db package boundaries", () => {
  it("declares workspace links to shared domain and config packages", () => {
    expect(packageJson.dependencies["@tft-doubleup/domain"]).toBe("workspace:*");
    expect(packageJson.devDependencies["@tft-doubleup/config"]).toBe("workspace:*");
  });

  it("exposes public db entrypoints for app packages", () => {
    expect(packageJson.exports).toMatchObject({
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js"
      },
      "./client": {
        types: "./dist/client.d.ts",
        import: "./dist/client.js"
      },
      "./schema": {
        types: "./dist/schema.d.ts",
        import: "./dist/schema.js"
      }
    });
  });
});
