import { readFile } from 'fs/promises'
import path from 'path'

import * as parser from '@typescript-eslint/parser'
import { TSESLint } from '@typescript-eslint/utils'
import { Program } from 'typescript'

import { rules } from './rules.js'
import importScope from '../src/index.js'

class ESLintTester {
  #projectRoot: string
  #linter: TSESLint.Linter
  #program: Program

  constructor(projectRoot: string) {
    this.#projectRoot = projectRoot
    this.#linter = new TSESLint.Linter({
      cwd: this.#projectRoot,
      configType: 'flat',
    })
    this.#program = parser.createProgram('./tsconfig.json', projectRoot)
  }

  async lintFile(filePath: string) {
    const fileAbsolutePath = path.join(this.#projectRoot, filePath)
    const code = await readFile(fileAbsolutePath, {
      encoding: 'utf8',
    })

    return this.#linter.verify(
      code,
      {
        files: ['**/*.ts'],
        languageOptions: {
          parser,
          parserOptions: {
            ecmaVersion: 2020,
            tsconfigRootDir: this.#projectRoot,
            project: './tsconfig.json',
            sourceType: 'module',
            program: this.#program,
          },
        },
        plugins: {
          'import-scope': importScope,
        },
        rules: {
          'import-scope/import-scope': ['error', rules],
        },
      },
      {
        filename: fileAbsolutePath,
      },
    )
  }
}

let cache: ESLintTester | undefined
/**
 * get an ESLint instance for testing.
 */
export function getESLintTester(): ESLintTester {
  const projectRoot = process.cwd()
  return (cache ||= new ESLintTester(projectRoot))
}
