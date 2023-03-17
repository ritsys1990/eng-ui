const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:react-hooks/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: ['react', 'jsx-a11y', 'import', 'prettier', 'sonarjs'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['src', path.resolve('./src')],
          ['env', path.resolve('./src/app/env.js')],
        ],
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
      },
    },
    'import/extensions': ['.js', '.ts', '.mjs', '.jsx', '.tsx'],
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-else-return': [
      1,
      {
        allowElseIf: true,
      },
    ],
    'prefer-exponentiation-operator': 0,
    'react/jsx-filename-extension': 0,
    'class-methods-use-this': 0,
    'react/destructuring-assignment': 0,
    'react/no-unescaped-entities': 0,
    'react/prop-types': [0, { ignore: ['ignore'], customValidators: ['customValidators'] }],
    'import/no-unresolved': 1,
    'import/prefer-default-export': 0,
    'max-classes-per-file': 0,
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'import/order': 0,
    'dot-notation': 0,
    'no-plusplus': 0,
    'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
    'react/jsx-props-no-spreading': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-underscore-dangle': ['error', { allow: ['__', '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] }],
    'no-debugger': 0,
    'no-unsafe-optional-chaining': 0,
    curly: 2,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-dynamic-require': 0,
    // Rules we can't implement now but will in the future
    'react/forbid-prop-types': [
      1,
      {
        forbid: ['any'],
      },
    ],
    'react/no-array-index-key': 0,
    'no-await-in-loop': 0,
    // Accessibility
    'jsx-a11y/label-has-associated-control': 0,
    'no-case-declarations': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
