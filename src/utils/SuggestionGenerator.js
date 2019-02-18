import Path from 'path'
import FsExtra from 'fs-extra'

export default {
	async getSuggestions(cwd, command) {
		switch (command) {
			case 'cd ':
				return await this.getDirectoryList(cwd)
			case 'npm ':
				return await this.getNpmCommandList(cwd)
			case 'npm uninstall ':
				return await this.getNpmUninstallList(cwd)
			case 'git ':
				return await this.getGitCommands(cwd)
		}
		return null
	},
	async getGitCommands() {
		return [
			'pull',
			'checkout',
			'status',
			'push',
			'commit',
		]
	},
	async getNpmUninstallList(cwd) {
		try {
			const packageJson = await FsExtra.readFile(
				Path.resolve(cwd, 'package.json')
			)
			const obj = JSON.parse(packageJson.toString())
			const map = Object.assign({}, obj.dependencies, obj.devDependencies)
			return Object.keys(map)
		} catch (error) {
			return []
		}
	},
	async getNpmCommandList(cwd) {
		const commandList = [
			'start',
			'install',
			'uninstall',
		]
		try {
			const packageJson = await FsExtra.readFile(
				Path.resolve(cwd, 'package.json')
			)
			const obj = JSON.parse(packageJson.toString())
			return [
				...commandList,
				...Object.keys(obj.scripts)
					.map(scriptName => ['run', scriptName].join(' ')),
			]
		} catch (error) {
			return [
				...commandList,
				'init',
			]
		}
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