import FsExtra from 'fs-extra'
import PathGenerator from '../utils/PathGenerator'
import Path from 'path'

let highestId = 0

const fileAreaPath = PathGenerator.getFileAreaPath()

if (!FsExtra.existsSync(fileAreaPath)) {
	FsExtra.mkdirpSync(fileAreaPath)
}

const list = FsExtra.readdirSync(fileAreaPath)
if (list && list.length) {
	highestId = Math.max(0, ...list.map(id => parseInt(id)))
}

export default {
	async generateNewId() {
		const newId = String(highestId + 1)
		const directoryPath = Path.resolve(fileAreaPath, newId)
		await FsExtra.mkdirp(directoryPath)
		return newId
	},
}

FsExtra.watch(fileAreaPath, onFileChange)

function onFileChange(type, filename) {
	const newId = parseInt(filename)
	highestId = Math.max(highestId, newId)
}

