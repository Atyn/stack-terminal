import PathGenerator from './PathGenerator'
import Path from 'path'

export default {
	getCwdFileContent(workingDirectory) {
		return workingDirectory
	},
	getStartFileContent(id) {
		const cwdFilePath = PathGenerator.getCwdFilePath(id)
		const commandFilePath = PathGenerator.getCommandFilePath(id)
		const outputFilePath = PathGenerator.getOutputFilePath(id)
		return [
			'#!/bin/bash',
			`cd $(cat ${cwdFilePath})`,
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
		return [
			'#!/bin/bash',
			`sh ${startFilePath} &`,
			`echo $$ > ${pidFilePath}`,
		].join('\n')
		// `sh ${startFilePath} & echo $! > ${pidFilePath}`
	},
	runCommand(id, command) {

	},
}