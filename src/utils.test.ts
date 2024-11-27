import { ScopeRule } from './types.js'
import { buildMatcher, checkInScope, parseScopeRules } from './utils'

describe('buildMatcher', () => {
  it.each([
    ['dir', 'features/*', 'features/a.ts', null],
    ['dir', 'features/*', 'features/a/b.ts', 'features/a'],
    ['dir', 'features/*', 'features/a/b/c.ts', 'features/a'],
    ['dir', 'features/*', 'x/features/a/b/c.ts', null],

    ['dir', 'features/a', 'features/a.ts', null],
    ['dir', 'features/a', 'features/a/b.ts', 'features/a'],
    ['dir', 'features/a', 'features/a/b/c.ts', 'features/a'],
    ['dir', 'features/a', 'x/features/a/b/c.ts', null],

    ['file', 'features/*/api.ts', 'features/api.ts', null],
    ['file', 'features/*/api.ts', 'features/a/api.ts', 'features/a'],
    ['file', 'features/*/api.ts', 'features/a/b/api.ts', null],
    ['file', 'features/*/api.ts', 'features/a/b.ts', null],
    ['file', 'features/*/api.ts', 'x/features/a/b/api.ts', null],

    ['file', 'features/**/api.ts', 'features/api.ts', 'features'],
    ['file', 'features/**/api.ts', 'features/a/api.ts', 'features/a'],
    ['file', 'features/**/api.ts', 'features/a/b/api.ts', 'features/a/b'],
    ['file', 'features/**/api.ts', 'features/a/b.ts', null],
    ['file', 'features/**/api.ts', 'x/features/a/b/api.ts', null],
  ] as const)('%j, %j, %j => %j', (type, glob, input, expected) => {
    expect(buildMatcher(type, glob)(input)).toBe(expected)
  })
})

const rules: ScopeRule[] = [
  { dir: 'features/*', scope: '.' },
  { dir: 'features/a', scope: ['.', 'app/a'] },
  { file: 'features/**/api.ts', scope: null },
]

it('parseScopeRules', () => {
  const parsed = parseScopeRules(rules)

  expect(parsed).toEqual([
    {
      file: 'features/**/api.ts',
      scopes: null,
      matcher: expect.any(Function),
    },
    {
      dir: 'features/a',
      scopes: ['.', 'app/a'],
      matcher: expect.any(Function),
    },
    {
      dir: 'features/*',
      scopes: ['.'],
      matcher: expect.any(Function),
    },
  ])
})

describe('checkInScope', () => {
  const parsed = parseScopeRules(rules)

  it.each([
    ['features/a/x.ts', 'features/a/y.ts', [true]],
    ['app/a/x.ts', 'features/a/y.ts', [true]],
    ['src/x.ts', 'features/a/y.ts', [false, ['features/a', 'app/a']]],
    ['features/a/x.ts', 'features/a/api.ts', [true]],
    ['app/a/x.ts', 'features/a/api.ts', [true]],
    ['src/x.ts', 'features/a/api.ts', [true]],

    ['features/b/x.ts', 'features/b/y.ts', [true]],
    ['app/b/x.ts', 'features/b/y.ts', [false, ['features/b']]],
    ['src/x.ts', 'features/b/y.ts', [false, ['features/b']]],
    ['features/b/x.ts', 'features/b/api.ts', [true]],
    ['app/b/x.ts', 'features/b/api.ts', [true]],
    ['src/x.ts', 'features/b/api.ts', [true]],
  ] as const)('%j, %j => %j', (source, target, [inScope, scopePaths]) => {
    expect(checkInScope(parsed, source, target)).toEqual({
      inScope,
      scopePaths,
    })
  })
})
