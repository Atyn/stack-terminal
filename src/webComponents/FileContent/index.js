import FsExtra from 'fs-extra'
import Path from 'path'
import { Terminal } from 'xterm'
import FileSyncer from '../../utils/FileSyncer'
import PathGenerator from '../../utils/PathGenerator'

const tagName = 'terminal-file-content'
export default tagName

// 'var(--default-margin)'

const filename = 'output'
const templates = {
	root:   document.createElement('div'),
	canvas: document.createElement('canvas'),
	pre:    document.createElement('pre'),
}

Object.assign(templates.canvas.style, {
	flexGrow: 1,
})

Object.assign(templates.pre.style, {
	flexGrow:      1,
	fontFamily:    'inherit',
	margin:        0,
	'white-space': 'pre-line',
})

const hostStyle = {
	display:       'flex',
	flexDirection: 'column',
	padding:       'var(--default-margin)',
}

templates.root.style.padding = '10px'

// Run by executing "sh ./start.sh & echo $! > pid"

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.listener = this.onFileChanged.bind(this)
		const shadowRoot = this.attachShadow({ mode: 'open' })
		// this.shadowRoot.appendChild(this.rootElement)
		this.canvas = templates.canvas.cloneNode(true)
		this.pre = templates.pre.cloneNode(true)
		this.shadowRoot.appendChild(this.pre)
		/*
		this.term = new Terminal()	
		this.term.open(this.canvas)
		console.log(this.canvas)
		this.shadowRoot.appendChild(this.canvas)
		*/
		
		// term.open(document.getElementById('terminal'))
		// term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

	}
	async disconnectedCallback() {
		this.fileWatcher.close()
	}
	async connectedCallback() {
		// const workingDirectory = this.getAttribute('working-directory')
		const id = this.getAttribute('job-id')
		this.fileWatcher = FileSyncer.sync(
			PathGenerator.getOutputFilePath(id),
			this.updateContentFromFile.bind(this)
		)
		Object.assign(this.style, hostStyle)
		/*
		const directory = Path.resolve(workingDirectory, id)
		this.watcher = FsExtra.watch(directory, this.listener)
		// Doest file exists?
		const filepath = Path.resolve(workingDirectory, id, filename)
		const exists = await FsExtra.exists(filepath)
		if (exists) {
			await this.updateContentFromFile()
		}
		*/
	}
	async onFileChanged(type, filepath) {
		if (filepath === filename) {
			this.updateContentFromFile()
		}
	}
	updateContentFromFile(content) {
		/*
		const workingDirectory = this.getAttribute('working-directory')
		const id = this.getAttribute('job-id')
		const filepath = Path.resolve(workingDirectory, id, filename)
		const buffer = await FsExtra.readFile(filepath)
		*/
		this.pre.innerHTML = content
	}
	async getRowElement() {
		const commandElement = await this.getCommandElement()
		commandElement.style.flexGrow = 1
		const statusElement = await this.getStatusElement()
		const buttonAreaElement = await this.getButtonAreaElement()
		statusElement.style.marginRight = 'var(--default-margin)'
		const element = document.createElement('div')
		statusElement.style.flexShrink = '0'
		element.style.display = 'flex'
		element.appendChild(statusElement)
		element.appendChild(commandElement)
		element.appendChild(buttonAreaElement)
		return element
	}
	async getRootElement() {
		const resultElement = await this.getResultElement()
		const rowElement = await this.getRowElement()
		const element = document.createElement('div')
		element.appendChild(rowElement)
		element.appendChild(resultElement)
		element.style.display = 'flex'
		element.style.flexDirection = 'column'
		return element
	}
	async getStatusElement() {
		const element = document.createElement('div')
		element.style.color = 'grey'
		element.innerHTML = 'status'
		return element
	}
	async getButtonAreaElement() {
		const element = document.createElement('div')
		element.innerHTML = 'execute'
		element.style.cursor = 'pointer'
		element.addEventListener('click', this.execute.bind(this))
		return element
	}
	async getCommandElement() {
		const id = this.getAttribute('id')
		const workingDirectory = this.getAttribute('working-directory')
		const commandFilePath = Path.resolve(workingDirectory, id, 'command.sh')
		console.log(commandFilePath)
		const buffer = await FsExtra.readFile(commandFilePath)
		const element = document.createElement('div')
		element.innerHTML = buffer.toString()
		return element
	}
	async getResultElement() {
		const element = document.createElement('div')
		return element
	}

	/*
	onFileChanged(changeType, filename) {
		this.list.push(filename) // Keep list in sync
		console.log('onFileChanged:', filename, changeType)
    } 
    
	async connectedCallback() {
		const workingDirectory = this.getAttribute('working-directory')
		this.workingDirectory = workingDirectory
		this.watcher = FsExtra.watch(workingDirectory, this.listener)
		const list = await FsExtra.readdir(workingDirectory)
		list.forEach(id => this.addEntryElement.bind(this))
	}
	addEntryElement(id) {
		const element = document.createElement(Entry)
		element.setAttribute('working-directory', this.workingDirectory)
		element.setAttribute('id', id)
		this.shadowRoot.appendChild(element)
    }
    */
}
customElements.define(tagName, WebComponent)