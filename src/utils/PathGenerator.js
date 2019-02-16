import Path from 'path'
const Os = require('os')
const tmpDir = Os.tmpdir()
const fileAreaPath = Path.resolve(tmpDir, 'stack-terminal')

export default {
	getFileAreaPath() {
		return fileAreaPath
	},
	getCwdFilePath(id) {
		return Path.resolve(fileAreaPath, id, 'cwd')
	},
	getCommandFilePath(id) {
		return Path.resolve(fileAreaPath, id, 'command.sh')
	},
	getStartFilePath(id) {
		return Path.resolve(fileAreaPath, id, 'start.sh')
	},
	getOutputFilePath(id) {
		return Path.resolve(fileAreaPath, id, 'output')
	},
	getPidFilePath(id) {
		return Path.resolve(fileAreaPath, id, 'pid')
	},
	getSpawnFilePath(id) {
		return Path.resolve(fileAreaPath, id, 'spawn.sh')
	},
	getExitStatusFilePath(id) {
		return Path.resolve(fileAreaPath, id, 'exitstatus')
	},
}