module.exports = {
  env: {
    es2021: true
  },
  extends: ['standard-with-typescript', 'plugin:react/recommended'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['packages/frontend/**/*.{ts,tsx}'],
      env: { browser: true },
      parserOptions: { project: ['packages/frontend/tsconfig.json'] }
    },
    {
      files: ['packages/backend/**/*.ts'],
      env: { node: true },
      parserOptions: { project: ['packages/backend/tsconfig.json'] }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 0
  }
}
