module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true // Add this to recognize Node.js globals
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    // Your rules
  },
  globals: {
    // Define global variables that ESLint should recognize
    process: 'readonly',
    module: 'readonly',
    require: 'readonly'
  }
};