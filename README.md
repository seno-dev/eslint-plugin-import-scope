# eslint-plugin-import-scope

This package provides a typescript-eslint rule that allows importing specified directories or files only inside _scope_ (specific directories).

## Installation

```sh
npm i -D eslint-plugin-import-access
```

## Usage

This plugin only supports Flat Config.

In **.eslintrc.js**:

```js
import typescriptEslintParser from '@typescript-eslint/parser'
import importScope from 'eslint-plugin-import-scope'

export default [
  // other settings...
  {
    // set up typescript-eslint
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-scope': importScope,
    },
    rules: {
      'import-scope/import-scope': [
        'error',
        [
          // rules
          { dir: 'features/*', scope: '.' },
          { dir: 'features/a', scope: ['.', 'app/a'] },
          { file: 'features/**/api.ts', scope: null },
        ],
      ],
    },
  },
]
```

The rules above work as follows:

- `{ dir: 'features/*', scope: '.' }`
  - All files in directories matching `features/*` can only be imported inside `features/*` itself.
- `{ dir: 'features/a', scope: ['.', 'app/a'] }`
  - All files in directory `features/a` can only be imported inside `features/a` or `app/a`.
- `{ file: 'features/**/api.ts', scope: null }`
  - Files matching `features/**/api.ts` can be imported from anywhere.

## Options

Rules are specified by an array of objects with the below options. If the file matches multiple rules, later rules take precedence.

- **`dir`** or **`file`** : `string`
  - Glob pattern of target directories or files.
- **`scope`** : `string | string[] | null`
  - Directories where the files in `dir`/`file` can be imported. (Relative path from matched `dir`/`file` or project root)
  - If null, the files can be imported from anywhere.
