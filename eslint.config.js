import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  eslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        HTMLElement: 'readonly',
        Element: 'readonly',
        NodeList: 'readonly',
        CustomEvent: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        navigator: 'readonly',
        module: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.astro/'],
  },
];
