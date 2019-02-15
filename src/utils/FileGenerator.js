
import PathGenerator from './PathGenerator'
import Path from 'path'

export default {
	getCwdFileContent(workingDirectory) {
		return workingDirectory
	},
	getStartFileContent(id, workingDirectory) {
		const cwdFilePath = PathGenerator.getCwdFilePath(id)
		const commandFilePath = PathGenerator.getCommandFilePath(id)
		const outputFilePath = PathGenerator.getOutputFilePath(id)
		return [
			'#!/bin/bash',
			`cd $(cat ${cwdFilePath})`,
			'pwd',
			[
				'sh',
				commandFilePath,
				'>',
				outputFilePath,
			].join(' '),
		].join('\n')
	},
	getSpawnFileContent(id) {
		const startFilePath = PathGenerator.getStartFilePath(id)
		const pidFilePath = PathGenerator.getPidFilePath(id)
		return `sh ${startFilePath} & echo $! > ${pidFilePath}`
	},
}