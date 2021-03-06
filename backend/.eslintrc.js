module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['import', '@typescript-eslint'],
  extends: [
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist'],
  rules: {
    'no-console': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: 'next' },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/first': 'error',
    'import/no-mutable-exports': 'error',
    'import/newline-after-import': 'error',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
  },
};
