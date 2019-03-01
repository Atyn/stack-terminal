import IdTracker from './IdTracker'
import PathGenerator from './PathGenerator'
import FsExtra from 'fs-extra'

export default {
	async find({
		fromIndex = IdTracker.getHighestId(), 
		toIndex = 0,
		onCommand,
	}) {
		const step = fromIndex < toIndex ? 1 : -1
		const length = Math.abs(fromIndex - toIndex) + 1
		const list = new Array(length)
			.fill(0)
			.map((_, index) => index * step + fromIndex)
		for (const id of list) {
			const buffer = await FsExtra.readFile(PathGenerator.getCommandFilePath(String(id)))
			const command = buffer.toString()			
			const results = onCommand(command, id)
			if (results) {
				return results
			}
		}
		return null
	},
}