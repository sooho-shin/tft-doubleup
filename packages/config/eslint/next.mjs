import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

import baseConfig from "./base.mjs";

export default tseslint.config(
  {
    ignores: [".next/**", "next-env.d.ts"]
  },
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules
    }
  }
);
