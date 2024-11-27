import { join } from 'path'

import { getESLintTester } from '../__fixtures__/eslint.js'

const tester = getESLintTester()

describe('import-scope', () => {
  it.each([
    'app/page.ts',
    'app/a/page.ts',
    'features/a/api.ts',
    'features/b/api.ts',
    'features/a/utils.ts',
    'features/b/utils.ts',
  ])('%s', async (filename) => {
    const result = await tester.lintFile(join('__fixtures__', filename))
    expect(result).toMatchSnapshot()
  })
})
