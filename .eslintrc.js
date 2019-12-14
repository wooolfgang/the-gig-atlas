module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    "jest/globals": true,
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
  plugins: ["react", "prettier", "jest"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "all",
        singleQuote: true,
        printWidth: 80
      }
    ],
    /**
     * ignore all unused variables that starts with underscore(e.g. const _foo = !0)
     */
    'no-unused-vars': ["error", { "argsIgnorePattern": "^_" }],
    // jest
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    // customs
    "no-confusing-arrow": "off",
    "implicit-arrow-linebreak": "off",
    "arrow-parens": "off",
    "comma-dangle": "off",
    "function-paren-newline": "off"
  },
};
