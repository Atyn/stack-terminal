import FsExtra from 'fs-extra'
import FileGenerator from '../utils/FileGenerator'
import PathGenerator from '../utils/PathGenerator'
import ChildProcess from 'child_process'
import IdTracker from './IdTracker'
import Path from 'path'

export default {
	async kill(id) {
		const buffer = await FsExtra.readFile(PathGenerator.getPidFilePath(id)) 
		const pid = buffer.toString()
		const command = `kill ${pid}`
		ChildProcess.exec(command, (error) => {
			if (error) {
				console.error(error)
			}
		})
	},
	async run(command, workingDirectory) {
		const id = await IdTracker.generateNewId()
		const commandFileContent = [
			'#!/bin/bash',
			command,
			'echo $? > ' + PathGenerator.getExitStatusFilePath(id),
		].join('\n')
		const executeCommand = `sh ${PathGenerator.getSpawnFilePath(id)}`
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
				FileGenerator.getCwdFileContent(workingDirectory)
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