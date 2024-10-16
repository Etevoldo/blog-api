// eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    rules: {
      semi: "error",
      "prefer-const": "warn",
      "no-unused-vars": "warn"
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin
      },
      ecmaVersion: "latest",
      sourceType: "commonjs"
    }
  }
];

