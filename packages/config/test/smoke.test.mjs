import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = path.join(packageRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const requiredExports = [
  "./eslint/base",
  "./eslint/next",
  "./tsconfig/base.json",
  "./tsconfig/next.json",
  "./tsconfig/node.json",
  "./tsconfig/package.json"
];

for (const exportName of requiredExports) {
  const target = packageJson.exports?.[exportName];

  if (typeof target !== "string") {
    throw new Error(`Missing config package export: ${exportName}`);
  }

  const targetPath = path.join(packageRoot, target);
  if (!existsSync(targetPath)) {
    throw new Error(`Config package export points to a missing file: ${exportName} -> ${target}`);
  }

  if (target.endsWith(".json")) {
    JSON.parse(readFileSync(targetPath, "utf8"));
  }
}

console.log("@tft-doubleup/config smoke test passed.");
