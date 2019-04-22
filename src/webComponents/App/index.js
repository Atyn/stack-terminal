import CommandArea from '../CommandArea'
import StackArea from '../StackArea'
import Path from 'path'
import FsExtra from 'fs-extra'
import Os from 'os'
import UserConfig from '../../configFile.json'
import PathGenerator from '../../utils/PathGenerator'

const tmpDir = Os.tmpdir()
const workingDirectory = Path.resolve(tmpDir, 'stack-terminal')
console.log('terminal directory:', workingDirectory)

FsExtra.mkdirp(workingDirectory)

const tagName = 'terminal-app'
export default tagName

const hostStyle = {
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	overflow: 'hidden',
}

const templates = {
	stackArea: document.createElement(StackArea),
	commandArea: document.createElement(CommandArea),
	root: document.createElement('div'),
}
Object.assign(templates.root.style, {
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	overflow: 'hidden',
})
Object.assign(templates.commandArea.style, {
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
	maxHeight: '100%',
})
Object.assign(templates.stackArea.style, {
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 1,
	flexGrow: 1,
})

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.workingDirectory = process.cwd()
		this.styleSheet = document.createElement('style')
		const rootElement = templates.root.cloneNode(true)
		const shadowRoot = this.attachShadow({ mode: 'open' })
		const commandArea = templates.commandArea.cloneNode(true)
		const stackArea = templates.stackArea.cloneNode(true)
		this.shadowRoot.addEventListener('click', () => {
			//	commandArea.focus()
		})
		stackArea.setAttribute('working-directory', workingDirectory)
		shadowRoot.appendChild(this.styleSheet)
		shadowRoot.appendChild(rootElement)
		rootElement.appendChild(stackArea)
		rootElement.appendChild(commandArea)
		// commandArea.addEventListener('command', this.onCommand.bind(this))
	}
	/*
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
	*/
	updateStyleSheet(config) {
		this.styleSheet.innerHTML = `
		:host {
			--background-color: ${config.colors.backgroundColor};
			--default-margin: ${config.margins.defaultMargin};
			font-family: ${config.font.family};
			background-color: var(--background-color);
			color: ${config.colors.fontColor};
		}
		`
	}
	getWorkingDirectory() {
		return this.workingDirectory
	}
	onConfigFileContent(fileContent) {
		// console.log(fileContent)
	}
	async connectedCallback() {
		Object.assign(this.style, hostStyle)
		console.log(PathGenerator.getUserConfigFilePath())
		this.updateStyleSheet(UserConfig)
		/*
		FileSyncer.sync(
			PathGenerator.getUserConfigFilePath(),
			this.onConfigFileContent.bind(this)
		)
		*/
	}
	/*
	async createCommandObject(command) {
		CommandRunner.run(command, this.workingDirectory)
	}
	*/
}

customElements.define(tagName, WebComponent)
