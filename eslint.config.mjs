import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"), {
    "extends": "next/core-web-vitals",
    "rules": {
      "@typescript-eslint/no-unused-vars": "warn",    // Show a warning for unused variables
      "@typescript-eslint/no-explicit-any": "warn"    // Show a warning for explicit any types
    }
  }

];

export default eslintConfig;
