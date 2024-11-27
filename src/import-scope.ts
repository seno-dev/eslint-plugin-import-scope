import { relative } from 'path'

import * as ts from 'typescript'

import { MessageId, ScopeRule, optionsSchema } from './types.js'
import { checkInScope, parseScopeRules, stringifyScopePaths } from './utils.js'

import type { TSESLint } from '@typescript-eslint/utils'

export const importScopeRule: TSESLint.RuleModule<MessageId, [ScopeRule[]]> = {
  meta: {
    type: 'problem',
    messages: {
      'no-program':
        'Type information is not available for this file. See https://typescript-eslint.io/getting-started/typed-linting/ for how to set this up.',
      'outside-scope':
        "Importing '{{ target }}' is only allowed inside {{ scope }}",
    },
    schema: [optionsSchema],
  },
  defaultOptions: [[]],
  create(context) {
    const {
      options: [rules],
      sourceCode,
    } = context
    const { parserServices } = sourceCode
    if (!parserServices) {
      return {}
    }

    const parsedRules = parseScopeRules(rules)

    return {
      ImportDeclaration(node) {
        const sourceFilename = context.filename
        if (!sourceFilename) {
          return
        }

        if (parserServices.program == null) {
          context.report({
            node,
            messageId: 'no-program',
          })
          return
        }

        if (parserServices.esTreeNodeToTSNodeMap == null) {
          throw new Error(
            'This rule requires the parser to provide the esTreeNodeToTSNodeMap in parserServices',
          )
        }

        const { resolvedModule } = ts.resolveModuleName(
          node.source.value,
          sourceFilename,
          parserServices.program.getCompilerOptions(),
          ts.sys,
        )
        const resolvedFileName = resolvedModule?.resolvedFileName
        if (!resolvedFileName) {
          return
        }

        const source = relative(process.cwd(), sourceFilename)
        const target = relative(process.cwd(), resolvedFileName)

        const { inScope, scopePaths } = checkInScope(
          parsedRules,
          source,
          target,
        )

        if (!inScope) {
          context.report({
            node,
            messageId: 'outside-scope',
            data: {
              target,
              scope: stringifyScopePaths(scopePaths),
            },
          })
        }
      },
    }
  },
}
