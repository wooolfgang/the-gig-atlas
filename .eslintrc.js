module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["prettier", "airbnb"], //"eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: true,
        printWidth: 80
      }
    ],
    /**
     * ignore all unused variables that starts with underscore(e.g. const _foo = !0)
     */
    'no-unused-vars': ["error", { "argsIgnorePattern": "^_" }],
  },
};
