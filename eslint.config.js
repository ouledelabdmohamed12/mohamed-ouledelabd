import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // JSX member-expression usage (e.g. <motion.div>) is not detected as a
      // reference without eslint-plugin-react's jsx-uses-vars rule, so the
      // lowercase `motion` import is allowlisted alongside the existing
      // PascalCase component / CONSTANT convention.
      'no-unused-vars': ['error', { varsIgnorePattern: '^([A-Z_]|motion$)' }],
    },
  },
  {
    // Serverless functions run on Node (Vercel), not in the browser.
    files: ['api/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
