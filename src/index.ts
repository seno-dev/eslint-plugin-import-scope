import { importScopeRule } from './import-scope.js'

import type { TSESLint } from '@typescript-eslint/utils'

const eslintPlugin: TSESLint.FlatConfig.Plugin = {
  rules: {
    'import-scope': importScopeRule,
  },
}

export default eslintPlugin
