import Path from 'path'
import FsExtra from 'fs-extra'

export default {
	async getSuggestions(cwd, command) {
		switch (command) {
			case 'cd ':
				return await this.getDirectoryList(cwd)
		}
		return null
	},
	async getDirectoryList(cwd) {
		const list = await FsExtra.readdirSync(cwd)
		const objectList = await Promise.all(
			list.map(async(name) => {
				const path = Path.resolve(cwd, name)
				const stats = await FsExtra.lstat(path)
				return {
					name, 
					isDirectory: stats.isDirectory(),
				}
			})
		)
		return objectList
			.filter(obj => obj.isDirectory)
			.map(obj => obj.name + '/')
	},
}