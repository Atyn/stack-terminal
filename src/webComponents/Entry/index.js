import FileContentViewer from '../FileContent'
import FsExtra from 'fs-extra'
import CommandRunner from '../../utils/CommandRunner'
import FileSyncer from '../../utils/FileSyncer'
import PathGenerator from '../../utils/PathGenerator'
import Templates from './Templates'

const tagName = 'terminal-entry'
export default tagName

const hostStyle = {
	display: 'flex',
	flexDirection: 'column',
	// padding:       'var(--default-margin)',
}

// Run by executing "sh ./start.sh & echo $! > pid"

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.elements = {
			style: Templates.style.cloneNode(true),
		}
		this.shadowRoot.appendChild(this.elements.style)
		this.intersectionObserver = new IntersectionObserver(
			this.onIntersection.bind(this),
			{
				rootMargin: '0px',
				threshold: 1.0,
				root: document.body,
			}
		)
		this.killButton = this.getKillButton()
		this.expandButton = this.getExpandButton()
		this.timeElement = document.createElement('div')
		Object.assign(this.timeElement.style, {
			whiteSpace: 'nowrap',
			opacity: 0.4,
		})
	}
	async expand() {
		if (this.outputElement) {
			this.expandButton.style.transform = 'rotate(0)'
			this.outputElement.remove()
			this.outputElement = null
		} else {
			this.expandButton.style.transform = 'rotate(-180deg)'
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
		const id = this.getAttribute('id')
		Object.assign(this.style, hostStyle)
		const rootElement = await this.getRootElement()
		this.rootElement = rootElement
		this.shadowRoot.appendChild(rootElement)
		this.intersectionObserver.observe(rootElement)
		this.watchers = [
			FileSyncer.sync(
				PathGenerator.getExitStatusFilePath(id),
				this.onStatus.bind(this)
			),
		]
		const fileStats = await FsExtra.stat(PathGenerator.getSpawnFilePath(id))
		this.timeElement.innerText = new Date(
			fileStats.atimeMs
		).toLocaleTimeString()
		this.shadowRoot.addEventListener('content-added', event => {
			this.dispatchEvent(
				new CustomEvent(event.type, {
					bubbles: true,
				})
			)
		})
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
		element.innerHTML = '&times;'
		element.addEventListener('click', this.kill.bind(this))
		Object.assign(element.style, {
			fontSize: '1.4em',
			cursor: 'pointer',
			fontWeight: 'bold',
		})
		return element
	}
	getExpandButton() {
		const element = Templates.expandButton.cloneNode(true)
		element.addEventListener('click', this.expand.bind(this))
		return element
	}
	async getRowElement() {
		const fillerElement = document.createElement('div')
		const commandElement = await this.getCommandElement()
		commandElement.style.flexGrow = 1
		commandElement.style.fontWeight = 'bold'
		const statusElement = await this.getStatusElement()
		this.statusElement = statusElement
		// const buttonAreaElement = await this.getButtonAreaElement()
		const element = Templates.row.cloneNode(true)
		statusElement.style.flexShrink = '0'
		element.appendChild(statusElement)
		element.appendChild(commandElement)
		element.appendChild(this.timeElement)
		element.appendChild(fillerElement)
		element.appendChild(this.killButton)
		element.appendChild(this.expandButton)
		// element.appendChild(buttonAreaElement)
		return element
	}
	async getRootElement() {
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
		const element = Templates.status.cloneNode(true)
		// element.innerHTML = 'status'
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
		const commandFilePath = PathGenerator.getCommandFilePath(id)
		const buffer = await FsExtra.readFile(commandFilePath)
		const element = Templates.title.cloneNode(true)

		const fileStats = await FsExtra.stat(PathGenerator.getSpawnFilePath(id))
		const timeText = new Date(fileStats.atimeMs).toLocaleTimeString()

		element.innerHTML = buffer.toString()
		element.title = timeText
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
