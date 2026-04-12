import nextConfig from "eslint-config-next";
import nextTs from "eslint-config-next/typescript";

// eslint-plugin-react@7 (bundled in eslint-config-next) не совместим с ESLint 10 —
// фильтруем его плагин и правила react/* из базового конфига.
const filteredNextConfig = nextConfig.map((entry) => {
  if (!entry.plugins) return entry;
  const { react: _react, ...otherPlugins } = entry.plugins;
  const filteredRules = Object.fromEntries(
    Object.entries(entry.rules ?? {}).filter(([key]) => !key.startsWith("react/"))
  );
  return { ...entry, plugins: otherPlugins, rules: filteredRules };
});

const eslintConfig = [
  // 1. Игнорируемые файлы
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

  // 2. Next.js + TypeScript (без eslint-plugin-react@7 несовместимого с ESLint 10)
  ...filteredNextConfig,
  ...nextTs,

  // 3. Дополнительные настройки
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
      }],
    },
  },
];

export default eslintConfig;