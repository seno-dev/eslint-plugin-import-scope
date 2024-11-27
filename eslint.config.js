import js from '@eslint/js'
import ts from 'typescript-eslint'
import globals from 'globals'
import import_ from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import importScope from './dist/src/index.js'
import { rules } from './__fixtures__/rules.js'

export default ts.config(
  {
    ignores: ['.next', 'dist', 'public', 'components/ui/snippets'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [...ts.configs.recommended],
    plugins: {
      import: import_,
      'unused-imports': unusedImports,
      'import-scope': importScope,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'import-scope/import-scope': ['error', rules],
      '@typescript-eslint/no-unused-expressions': 'off',

      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-empty': 'off',
      'no-undef': 'off',
      'object-shorthand': 'error',

      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/unbound-method': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          'ts-check': false,
          minimumDescriptionLength: 3,
        },
      ],
      '@typescript-eslint/promise-function-async': [
        'error',
        {
          checkArrowFunctions: true,
          checkFunctionDeclarations: true,
          checkFunctionExpressions: true,
          checkMethodDeclarations: true,
        },
      ],

      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            ['parent', 'sibling', 'index'],
            'type',
          ],
          alphabetize: { order: 'asc' },
        },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
  },
)
