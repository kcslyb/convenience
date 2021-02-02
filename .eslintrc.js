module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
