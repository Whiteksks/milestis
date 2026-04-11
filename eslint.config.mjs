import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Игнорируемые файлы (вместо globalIgnores)
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "functions/lib/**",
    ],
  },

  // 2. Правила Next.js и TypeScript через адаптер
  // Это автоматически подтянет и core-web-vitals, и настройки для TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 3. Твои дополнительные настройки (если нужны)
  {
    rules: {
      // Например, можно добавить: "no-unused-vars": "warn"
    },
  },
];

export default eslintConfig;