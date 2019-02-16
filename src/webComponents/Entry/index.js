import FileContentViewer from '../FileContent'
import FsExtra from 'fs-extra'
import Path from 'path'
import ChildProcess from 'child_process'
import CommandRunner from '../../utils/CommandRunner'
import FileSyncer from '../../utils/FileSyncer'
import PathGenerator from '../../utils/PathGenerator'

const tagName = 'terminal-entry'
export default tagName

const templates = {
	root: document.createElement('div'),	
}

const hostStyle = {
	display:       'flex',
	flexDirection: 'column',
	// padding:       'var(--default-margin)',
}

templates.root.style.padding = '10px'

// Run by executing "sh ./start.sh & echo $! > pid"

class WebComponent extends HTMLElement {
	constructor() {
		super()
		const shadowRoot = this.attachShadow({ mode: 'open' })
		this.intersectionObserver = new IntersectionObserver(
			this.onIntersection.bind(this), {
				rootMargin: '0px',
				threshold:  1.0,
				root:       document.body,
			})
		this.killButton = this.getKillButton()
		this.expandButton = this.getExpandButton()
	}
	async expand() {
		if (this.outputElement) {
			this.expandButton.style.transform = 'rotate(-90deg)'
			this.outputElement.remove()
			this.outputElement = null
		} else {
			this.expandButton.style.transform = 'rotate(90deg)'
			const outputElement = await this.getOutputElement()
			this.outputElement = outputElement
			this.rootElement.appendChild(outputElement)
		}
	}
	kill() {
		const id = this.getAttribute('id')
		CommandRunner.kill(id)
	}
	onIntersection(entries) {
		entries.forEach(entry => {
			entry.isIntersecting
		})		
	}
	disconnectedCallback() {
		this.intersectionObserver.unobserve()
		this.watchers.forEach(watcher => watcher.close())
	}
	async connectedCallback() {
		Object.assign(this.style, hostStyle)
		const rootElement = await this.getRootElement()
		this.rootElement = rootElement
		this.shadowRoot.appendChild(rootElement)
		const id = this.getAttribute('id')
		this.intersectionObserver.observe(rootElement)
		this.watchers = [
			FileSyncer.sync(
				PathGenerator.getExitStatusFilePath(id),
				this.onStatus.bind(this)
			),
		]
	}
	onStatus(value) {
		const status = Number.parseInt(value)
		this.killButton.remove()
		if (status) {
			this.statusElement.style.color = 'red'
		} else {
			this.statusElement.style.color = 'rgb(68, 255, 59)'
		}
	}
	getKillButton() {
		const element = document.createElement('div')
		element.innerHTML = 'X'
		element.addEventListener('click', this.kill.bind(this))
		Object.assign(element.style, {
			cursor:     'pointer',
			fontWeight: 'bold',
			padding:    'var(--default-margin)',
		})
		return element
	}
	getExpandButton() {
		const element = document.createElement('div')
		element.innerHTML = '>'
		element.addEventListener('click', this.expand.bind(this))
		Object.assign(element.style, {
			cursor:     'pointer',
			fontWeight: 'bold',
			padding:    'var(--default-margin)',
			transition: 'transform 0.6s',
			transform:  'rotate(90deg)',
		})
		return element
	}
	async getRowElement() {
		const commandElement = await this.getCommandElement()
		commandElement.style.flexGrow = 1
		commandElement.style.fontWeight = 'bold'
		const statusElement = await this.getStatusElement()
		this.statusElement = statusElement
		// const buttonAreaElement = await this.getButtonAreaElement()
		statusElement.style.marginRight = 'var(--default-margin)'
		const element = document.createElement('div')
		statusElement.style.flexShrink = '0'
		Object.assign(element.style, {
			display:         'flex',
			position:        'sticky',
			alignItems:      'center',
			padding:         'var(--default-margin)',
			top:             0,
			backgroundColor: 'var(--background-color)',
		})
		element.appendChild(statusElement)
		element.appendChild(commandElement)
		element.appendChild(this.killButton)
		element.appendChild(this.expandButton)
		// element.appendChild(buttonAreaElement)
		return element
	}
	async getRootElement() {
		const workingDirectory = this.getAttribute('working-directory')
		const id = this.getAttribute('id')
		const resultElement = await this.getResultElement()
		const rowElement = await this.getRowElement()
		const element = document.createElement('div')
		const outputElement = await this.getOutputElement()
		this.outputElement = outputElement
		element.appendChild(rowElement)
		element.appendChild(resultElement)
		element.appendChild(outputElement)
		element.style.display = 'flex'
		element.style.flexDirection = 'column'
		element.style.position = 'relative'
		return element
	}
	async getOutputElement() {
		const workingDirectory = this.getAttribute('working-directory')
		const id = this.getAttribute('id')
		const outputElement = document.createElement(FileContentViewer)
		outputElement.style.padding = 'var(--default-margin)'
		outputElement.setAttribute('working-directory', workingDirectory)
		outputElement.setAttribute('job-id', id)
		return outputElement
	}
	async getStatusElement() {
		const element = document.createElement('div')
		Object.assign(element.style, {
			color:           'yellow',
			height:          '0.8em',
			width:           '0.8em',
			backgroundColor: 'currentColor',
			borderRadius:    '50%',
		})
		// element.innerHTML = 'status'
		return element
	}
	async execute() {
		const id = this.getAttribute('id')
		const workingDirectory = this.getAttribute('working-directory')
		const spawnFilePath = Path.resolve(workingDirectory, id, 'spawn.sh')
		const command = `bash ${spawnFilePath}`
		console.log('command:', command)
		ChildProcess.exec(`bash ${spawnFilePath}`, (error) => {
			if (error) {
				console.error(error)
			}
		})
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