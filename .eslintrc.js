const warn = 'warn'
const off = 'off'
const tab = 'tab'
const error = 'error'
const always = 'always'
const never = 'never'

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
		sourceType: 'module',
	},
	rules: {},
}
