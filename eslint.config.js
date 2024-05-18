import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
    {
        ignores: ["dist", "node_modules", ".env"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                "process": "readonly"
            }
        },
        rules: {
            "no-unused-vars": "error",
            "prefer-const": "error",
            "no-unused-expressions": "error",
            "no-undef": "error",
            "no-console": "warn",
            "@typescript-eslint/consistent-type-definitions": ["error", "type"]
        }
    }
];
