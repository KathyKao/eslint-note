module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    // extends 套件名稱前面的 eslint-config- 可以省略
    // 'airbnb-base' <==> eslint-config-airbnb-base
    'plugin:vue/vue3-essential',
    'standard-with-typescript', // <==> eslint-config-standard-with-typescript
    'plugin:prettier/recommended',
    'prettier', // <==> eslint-config-prettier
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    // plugins 套件名稱前面的 eslint-plugin- 可以省略
    'vue', // <==> eslint-plugin-vue
    'prettier', // <==> eslint-plugin-prettier
  ],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'spaced-comment': 'off',
    // 'no-unused-vars': 'off',
  },
};
