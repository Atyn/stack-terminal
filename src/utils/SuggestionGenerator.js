import Path from 'path'
import FsExtra from 'fs-extra'

const config = [{
	regExp:         /^cd\s/,
	getSuggestions: getPaths,
}, {
	regExp:         /^ls\s(-\S+\s)?/,
	getSuggestions: getPaths,
}, {
	regExp:         /^git\sbranch\s/,
	getSuggestions: getGitCommands,
}, {
	regExp:         /^git\s/,
	getSuggestions: getGitBranchCommands,
}, {
	regExp:         /^npm\s/,
	getSuggestions: getNpmCommands,
}, {
	regExp:         /^\S+$/,
	getSuggestions: getExecuteCommands,
}, {
	regExp:         /(\$\{)(\S*)$/,
	getSuggestions: getVariableSuggestions,
}]

async function getVariableSuggestions(regExp, cwd, command) {
	const results = new RegExp(regExp).exec(command)
	const content = results[2]
	return Object.keys(process.env)
		.filter(key => key.startsWith(content))
		.map(key => ({
			prefix: '${' + content,
			value:  key.replace(content, '') + '} ',
		}))
}

/**
 * @param {String} cwd 
 * @param {String} command 
 */
async function getPaths(regExp, cwd, command) {
	const str = command.replace(regExp, '')
	const directories = str.split('/')
	const preDirectories = directories.slice(0, directories.length - 1)
	const directoryPath = Path.join(cwd, ...preDirectories)
	const directoryList = await getDirectoryList(directoryPath)
	const list = [
		'../',
		...directoryList,
	]
	const firstPart = Path.join(cwd, str)	
	return list
		.filter(directory => directory.startsWith(firstPart))
		.map(directory => {
			const value = directory
				.replace(firstPart, '')
			return {
				prefix: directory
					.replace(directoryPath, '')
					.replace(value, '')
					.replace(/^\//, ''),
				value: value
					.replace(/^\//, ''),
			}
		})
}

async function getExecuteCommands(regExp, cwd, command) {
	const paths = process.env.PATH.split(':')
	const list = await Promise.all(paths.map(getRunnablesInDirectory))
	const runnables = list.flat()
	return runnables
		.filter(runnable => runnable.startsWith(command))
		.map(name => ({
			prefix: command,
			value:  name.replace(command, '') + ' ',
		}))
}

async function getRunnablesInDirectory(directory) {
	const exists = await FsExtra.exists(directory)
	if (!exists) {
		return []
	}
	const list = await FsExtra.readdir(directory)
	return list
}

async function getNpmCommands(regExp, cwd, command) {
	const str = command.replace(regExp, '')
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
		const list = [
			...commandList,
			...Object.keys(obj.scripts)
				.map(scriptName => ['run', scriptName].join(' ')),		
		]

		return list
			.filter(name => name.startsWith(str))
			.map(name => {
				return name
			})
			.map(name => ({
				prefix: str,
				value:  name.replace(str, ''),
			}))
	} catch (error) {
		return commandList
	}
}

async function getGitBranchCommands(regExp, cwd, command) {

}

async function getGitCommands(regExp, cwd, command) {
	const str = command.replace(regExp, '')
	return [
		'pull',
		'checkout',
		'status',
		'push',
		'commit',
		'branch',
	]
		.filter(directory => directory.startsWith(str))
		.map(name => ({
			prefix: str,
			value:  name.replace(str, '') + ' ',
		}))
}

export default {
	/*
	config: {
		'git':           this.getGitCommands,
		'git branch':    this.getGitBranchList, 
		'npm':           this.getNpmUninstallList,
		'npm uninstall': this.getNpmUninstallList,
	},
	*/

	/**
	 * @param {String} cwd 
	 * @param {String} command 
	 */
	async getSuggestions(cwd, command) {
		for (const configObject of config) {			
			if (configObject.regExp.test(command)) {
				return await configObject.getSuggestions(
					configObject.regExp,
					cwd,
					command
				)
			}
		}
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
			'install ',
			'uninstall ',
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
			.map(name => Path.join(cwd, name))
	},
}

async function getDirectoryList(cwd) {
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
		.map(name => Path.join(cwd, name))
}