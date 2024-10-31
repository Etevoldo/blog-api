// eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "semi": "error"
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

