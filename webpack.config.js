
const externals = {}
const excluedModules = [
	'fs',
	'fs-extra',
]
excluedModules.forEach(name => {
	externals[name] = `require(${name})`
})

module.exports = {
	externals,
}