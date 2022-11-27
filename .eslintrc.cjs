/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.spec.json'],
  },
  extends: [
    '@nexterias/eslint-config-common',
    '@nexterias/eslint-config-typescript',
    '@nexterias/eslint-config-node',
    'prettier',
  ],
  rules: {
    'no-useless-constructor': 0,
    'n/no-missing-import': 0,
  },
}

module.exports = config
