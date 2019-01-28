import CommandArea from '../CommandArea/index.js'
import StackArea from '../StackArea/index.js'

const FsExtra = require('fs-extra')
const Os = require('os')
const Path = require('path')

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
		const shadowRoot = this.attachShadow({ mode: 'open' })
		const commandArea = templates.commandArea.cloneNode(true)
		const stackArea = templates.stackArea.cloneNode(true)
		stackArea.setAttribute('working-directory', workingDirectory)
		shadowRoot.appendChild(stackArea)
		shadowRoot.appendChild(commandArea)
		commandArea.addEventListener('command', (event) => {
			const command = event.detail
			this.createCommandObject(command)
		})
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
		await FsExtra.mkdirp(directoryPath)
		await FsExtra.writeFile(commandFilePath, command)
	}
}

customElements.define(tagName, WebComponent)