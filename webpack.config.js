
const externals = {}
const excluedModules = [
	'fs',
	'fs-extra',
	'path',
	'os',
]
excluedModules.forEach(name => {
	externals[name] = `require('${name}')`
})

console.log(externals)

module.exports = {
	externals,
	target: 'electron-renderer',
}

// electron-main || node