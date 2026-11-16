import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**'] },
  eslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module', ecmaVersion: 'latest' },
      globals: {
        process: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
        document: 'readonly',
        window: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: { ...tsPlugin.configs.recommended.rules },
  },
  { files: ['src/scripts/**/*.ts'], languageOptions: { globals: globals.browser } },
  prettier,
];
