import FsExtra from 'fs-extra'
import FileGenerator from '../utils/FileGenerator'
import PathGenerator from '../utils/PathGenerator'
import ChildProcess from 'child_process'
import Path from 'path'

export default {
	async run(id, command) {
		const commandFileContent = [
			'#!/bin/bash',
			command,
			'echo $? > ' + PathGenerator.getExitStatusFilePath(id),
		].join('\n')
		const directoryPath = Path.resolve(PathGenerator.getFileAreaPath(), id)
		const executeCommand = `sh ${PathGenerator.getSpawnFilePath(id)}`
		await FsExtra.mkdirp(directoryPath)
		await Promise.all([
			FsExtra.writeFile(
				PathGenerator.getCommandFilePath(id), 
				commandFileContent
			),
			FsExtra.writeFile(
				PathGenerator.getSpawnFilePath(id), 
				FileGenerator.getSpawnFileContent(id)
			),
			FsExtra.writeFile(
				PathGenerator.getCwdFilePath(id), 
				FileGenerator.getCwdFileContent(id)
			),
			FsExtra.writeFile(
				PathGenerator.getStartFilePath(id), 
				FileGenerator.getStartFileContent(id)
			),
		])
		setTimeout(() => {
			// Execute
			ChildProcess.exec(executeCommand, (error) => {
				if (error) {
					console.error(error)
				}
			})
		}, 1)
	},
}