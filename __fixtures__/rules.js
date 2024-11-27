export const rules = [
  { dir: '__fixtures__/features/*', scope: '.' },
  {
    dir: '__fixtures__/features/a',
    scope: ['.', '__fixtures__/app/a'],
  },
  { file: '__fixtures__/features/**/api.ts', scope: null },
]
