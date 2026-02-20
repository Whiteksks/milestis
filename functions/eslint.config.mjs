import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["lib/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {},
  },
];
