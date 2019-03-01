
const warn = 'warn'
const off = 'off'
const tab = 'tab'
const error = 'error'
const always = 'always'
const never = 'never'

const indent = [
  warn, tab,
   {
     FunctionExpression: {
       parameters: 1,
     },
     FunctionDeclaration: {
       parameters: 1,
     },
     CallExpression: {
       arguments: 1,
     },
     MemberExpression: 1,
     SwitchCase: 1,
   }
]

module.exports = {
    parser: 'babel-eslint',
    plugins: [
      // 'flowtype'
    ],
    globals: {},
    env: {
      browser: true,
      es6: true,
      node: true,
      worker: true,
      jasmine: true,
    },
    extends: [
      // 'plugin:flowtype/recommended',
      'eslint:recommended',
      // 'plugin:react/recommended',
    ],
    parserOptions: {
      ecmaVersion: 2017,
      'sourceType': 'module'
    },
    rules: {
      //'prefer-stateless-function' : warn,'
      'complexity': [warn, 20],
      'no-console': off,
      'no-unused-vars': warn,
      'indent': indent,
      'no-const-assign': error,

      // No bloated code
      'no-alert': warn,
      'quotes': [warn, 'single'],
      'semi': [warn, 'never'],
      'no-global-assign': warn,
      'no-global-assign': warn,

      // Code quality
      'multiline-ternary': [warn, "always"],
      'no-unexpected-multiline': error,
      'prefer-const': warn,
      'no-empty': warn,
      'no-shadow': warn,
      'no-invalid-this': warn,
      'consistent-return': warn,
      'func-names': [warn, always],
      'func-style': [warn, 'declaration', { allowArrowFunctions: true }],
      'vars-on-top': warn,
      'global-require': warn,
      'init-declarations': [warn, always],
      'no-use-before-define': [warn, { functions: false }],

       // Looking good
      'yoda': warn,
      'no-multi-spaces': error,
      'no-multiple-empty-lines': [ warn, { max: 1 }],
      'comma-spacing': ["error", { "before": false, "after": true }],
      'object-curly-spacing': [warn, 'always'],
      'space-infix-ops': warn,
      'brace-style': warn,
      'comma-dangle': [warn, 'always-multiline'],
      'space-in-parens': warn,
      // 'key-spacing': ["error", { "beforeColon": false }],
      'key-spacing': [error, { 
          singleLine: { 
            "beforeColon": false,
            "afterColon": true
          }, 
          multiLine: {
            "align": "value"
          } 
        }],
      'keyword-spacing': warn,
      'no-extra-semi': warn,
      'no-irregular-whitespace': warn,
      'spaced-comment': warn,
      'func-call-spacing': [error, never],
      'dot-notation': warn,
      'space-before-function-paren': [warn, 'never'],
      'space-before-blocks': warn,
      'dot-location': ["error", "property"],

       // es6 stuff
      'arrow-spacing': warn,
      'no-var': warn,
      'prefer-rest-params': warn,

    }
}