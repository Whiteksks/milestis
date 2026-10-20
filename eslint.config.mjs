import nextConfig from "eslint-config-next";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".verification/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "functions/**",
    ],
  },

  ...nextConfig,
  ...nextTs,

  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
      }],
      // Hydration guards and effect-based cleanup update local UI state.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
