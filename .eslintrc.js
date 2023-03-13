module.exports = {
  root: true,
  env: {
    es2021: true
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:prettier/recommended'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: './tsconfig.eslint.json',
    sourceType: 'module'
  },
  rules: {
    "import/prefer-default-export": "off",
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
      }
    ],
    "import/no-default-export": "error"
  }

}
