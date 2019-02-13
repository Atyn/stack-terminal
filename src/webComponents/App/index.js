import CommandArea from '../CommandArea'
import StackArea from '../StackArea'
import Path from 'path'
import FsExtra from 'fs-extra'
import ChildProcess from 'child_process'

const Os = require('os')

const tmpDir = Os.tmpdir()
const workingDirectory = Path.resolve(tmpDir, 'stack-terminal')
console.log('terminal directory:', workingDirectory)

FsExtra.mkdirp(workingDirectory)

const tagName = 'terminal-app'
export default tagName

const hostStyle = {
	display:       'flex',
	flexDirection: 'column',
	flexGrow:      1,
	overflow:      'hidden',
}

const templates = {
	stackArea:   document.createElement(StackArea),
	commandArea: document.createElement(CommandArea),
}

templates.stackArea.style.flexGrow = 1

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.workingDirectory = process.cwd()
		const shadowRoot = this.attachShadow({ mode: 'open' })
		const commandArea = templates.commandArea.cloneNode(true)
		const stackArea = templates.stackArea.cloneNode(true)
		const directoryElement = document.createElement('div')
		directoryElement.style.padding = 'var(--default-margin)'
		directoryElement.style.color = '#44ff3b'
		directoryElement.innerHTML = this.getWorkingDirectory()
		directoryElement.style.fontWeight = 'bold'

		this.directoryElement = directoryElement
		stackArea.setAttribute('working-directory', workingDirectory)
		shadowRoot.appendChild(stackArea)
		shadowRoot.appendChild(directoryElement)
		shadowRoot.appendChild(commandArea)
		commandArea.addEventListener('command', this.onCommand.bind(this))
	}
	async onCommand(event) {
		const command = event.detail
		if (command === 'cd') {
			console.log('command cd - do nothing')
		} else if (command.startsWith('cd ')) {
			const newWorkingDirectory = Path.resolve(
				this.workingDirectory, 
				command.replace('cd ', '')
			)
			console.log(newWorkingDirectory)
			const pathExists = await FsExtra.pathExists(newWorkingDirectory)
			if (pathExists) {
				this.workingDirectory = newWorkingDirectory
				this.directoryElement.innerHTML = this.getWorkingDirectory()
			} else {
				console.warn('Path', pathExists, 'doesnt exists')
			}
			// this.workingDirectory = this.workingDirectory
		} else {
			this.createCommandObject(command)
		}
	}
	getWorkingDirectory() {
		return this.workingDirectory
	}
	async connectedCallback() {
		Object.assign(this.style, hostStyle)
		this.watcher = FsExtra.watch(workingDirectory, this.listener)
		const list = await FsExtra.readdir(workingDirectory)
		this.list = list
		this.highestId = Math.max(0, ...list.map(id => parseInt(id)))
	}
	async createCommandObject(command) {
		this.highestId++
		const id = String(this.highestId)
		const directoryPath = Path.resolve(workingDirectory, id)
		const commandFilePath = Path.resolve(workingDirectory, id, 'command.sh')
		const startFilePath = Path.resolve(workingDirectory, id, 'start.sh')
		const cwdFilePath = Path.resolve(workingDirectory, id, 'cwd')
		const spawnFilePath = Path.resolve(workingDirectory, id, 'spawn.sh')
		const pidFilePath = Path.resolve(workingDirectory, id, 'pid')
		const spawnFileContent = `sh ${startFilePath} & echo $! > ${pidFilePath}`
		const startContent = [
			'#!/bin/bash',
			`cd $(cat ${cwdFilePath})`,
			'pwd',
			[
				'sh',
				Path.resolve(workingDirectory, id, 'command.sh'),
				'>',
				Path.resolve(workingDirectory, id, 'output'),
			].join(' '),
		].join('\n')
		await FsExtra.mkdirp(directoryPath)
		await Promise.all([
			FsExtra.writeFile(commandFilePath, [
				'#!/bin/bash',
				command,
				'echo $? > ' + Path.resolve(workingDirectory, id, 'exitstatus'),
			].join('\n')),
			FsExtra.writeFile(spawnFilePath, spawnFileContent),
			FsExtra.writeFile(cwdFilePath, this.getWorkingDirectory()),
			FsExtra.writeFile(startFilePath, startContent),
		])
		// Execute
		ChildProcess.exec(`bash ${spawnFilePath}`, (error) => {
			if (error) {
				console.error(error)
			}
		})

	}
}

customElements.define(tagName, WebComponent)