import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import astroEslint from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  ...astroEslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,astro}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Astro specific overrides
      'no-unused-vars': 'off', // Handled by TypeScript
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslint.parser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: ['.astro'],
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['tailwind.config.ts', '*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      '.venv/',
      'uv.lock',
      '*.config.js',
      '*.config.mjs',
      '**/*.astro', // Temporarily ignore Astro files due to parser issues
    ],
  },
];
