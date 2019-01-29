
const externals = {}
const excluedModules = [
	'fs',
	'fs-extra',
	'path',
]
excluedModules.forEach(name => {
	externals[name] = `require(${name})`
})

module.exports = {
	externals,
}