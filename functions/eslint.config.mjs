import js from "@eslint/js";
import tseslint from "typescript-eslint";

const eslintConfig = [
  // 1. Игнорируемые папки
  {
    ignores: ["lib/**", "node_modules/**"],
  },
  
  // 2. Базовые правила JS
  js.configs.recommended,
  
  // 3. Правила TypeScript (разворачиваем массив через ...)
  ...tseslint.configs.recommended,

  // 4. Твои настройки
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
    },
  },
];

export default eslintConfig;