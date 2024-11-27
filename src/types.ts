import { JSONSchema4 } from '@typescript-eslint/utils/json-schema'

export type MessageId = 'no-program' | 'outside-scope'

export type ScopeValue = string | string[] | null

export type ScopeRule =
  | { dir: string; file?: never; scope: ScopeValue }
  | { dir?: never; file: string; scope: ScopeValue }

export type ParsedScopeRule = Omit<ScopeRule, 'scope'> & {
  scopes: string[] | null
  matcher: (input: string) => string | null
}

const scopeRuleSchema: JSONSchema4 = {
  anyOf: [
    { type: 'string' },
    { type: 'array', items: { type: 'string' }, minItems: 1 },
    { type: 'null' },
  ],
}

export const optionsSchema: JSONSchema4 = {
  type: 'array',
  items: {
    anyOf: [
      {
        type: 'object',
        properties: {
          dir: { type: 'string' },
          scope: scopeRuleSchema,
        },
      },
      {
        type: 'object',
        properties: {
          file: { type: 'string' },
          scope: scopeRuleSchema,
        },
      },
    ],
  },
}
