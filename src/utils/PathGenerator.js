import Path from 'path'
const Os = require('os')
const tmpDir = Os.tmpdir()
const fileAreaPath = Path.resolve(tmpDir, 'stack-terminal')

export default {
	getFileAreaPath() {
		return fileAreaPath
	},
	getCwdFilePath(id) {
        
	},
	getCommandFilePath(id) {

	},
	getStartFilePath(id) {

	},
	getOutputFilePath(id) {

	},
	getPidFilePath(id) {
        
	},
}