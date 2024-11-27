import { join } from 'path'

import pm from 'picomatch'
import { ParseState } from 'picomatch/lib/parse'

import { ParsedScopeRule, ScopeRule } from './types.js'

export type MatchType = 'dir' | 'file'

function compileReWithChildren(state: ParseState) {
  return pm.compileRe(
    { ...state, output: `^(?:${state.output})(?=\\/)` },
    { contains: true },
  )
}

export function buildMatcher(
  type: MatchType,
  glob: string,
): (input: string) => string | null {
  const state = pm.parse(glob)

  if (type === 'dir') {
    const regex = compileReWithChildren(state)

    return (input: string) => {
      const match = regex.exec(input)
      if (!match) {
        return null
      }
      return match[0]
    }
  } else {
    const regex = pm.compileRe(state)

    return (input: string) => {
      const match = regex.exec(input)
      if (!match) {
        return null
      }
      return match[0].split('/').slice(0, -1).join('/')
    }
  }
}

export function parseScopeRules(rules: ScopeRule[]): ParsedScopeRule[] {
  return [...rules].reverse().map(({ scope, ...entry }) => {
    const scopes =
      scope === null ? null : typeof scope === 'string' ? [scope] : scope

    const matcher =
      typeof entry.dir === 'string'
        ? buildMatcher('dir', entry.dir)
        : buildMatcher('file', entry.file)

    return { ...entry, scopes, matcher }
  })
}

type ScopeCheckResult =
  | { inScope: true; scopePaths?: never }
  | { inScope: false; scopePaths: string[] }

export function checkInScope(
  parsedRules: ParsedScopeRule[],
  source: string,
  target: string,
): ScopeCheckResult {
  for (const { matcher, scopes } of parsedRules) {
    const baseDir = matcher(target)
    if (baseDir) {
      if (scopes === null) {
        return { inScope: true }
      }
      const scopePaths = scopes.map((scope) => {
        return scope.match(/^\.{1,2}(?:\/|$)/) ? join(baseDir, scope) : scope
      })
      const inScope = scopePaths.some((scopePath) => {
        return source.startsWith(`${scopePath}/`)
      })
      if (inScope) {
        return { inScope: true }
      }
      return { inScope: false, scopePaths }
    }
  }
  return { inScope: true }
}

export function stringifyScopePaths(scopePaths: string[]) {
  const quoted = scopePaths.map((path) => `'${path}'`)
  return [quoted.slice(0, -1).join(', '), quoted.at(-1)]
    .filter(Boolean)
    .join(' or ')
}
