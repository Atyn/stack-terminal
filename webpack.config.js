
const externals = {}
const excluedModules = [
	'fs',
	'fs-extra',
	'path',
	'os',
	'child_process',
]
excluedModules.forEach(name => {
	externals[name] = `require('${name}')`
})

module.exports = {
	externals,
	target: 'electron-renderer',
}

// electron-main || node