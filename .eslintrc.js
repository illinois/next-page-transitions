module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  rules: {
    'no-unused-vars': [
      'error',
      { args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'no-console': ['error', { allow: ['error'] }],
    'arrow-body-style': ['off'],
    'jsx-a11y/anchor-is-valid': ['off'],
  },
  settings: {
    "import/resolver": {
      "babel-module": {
        "root": ["./src"],
        "alias": {
          "src": "./src",
          "examples": "./examples"
        }
      }
    }
  }
}
