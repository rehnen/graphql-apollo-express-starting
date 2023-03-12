module.exports = {
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
    "import/no-default-export": "error"
  }

}
