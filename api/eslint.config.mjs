import eslint from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [
    eslint.configs.recommended,

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: true,
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        rules: {
            ...typescriptPlugin.configs.recommended.rules,
            ...typescriptPlugin.configs["stylistic-type-checked"].rules,

            // Custom rules
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": "error",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "prefer-const": "error",
            "eqeqeq": "error",
        },
    },

    {
        files: ["**/*.test.ts", "**/*.spec.ts"],
        rules: {
            "no-console": "off",
        },
    },

    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "coverage/**",
            "*.config.js",
            ".eslintrc.js" // Ignore config files if needed
        ],
    },
];