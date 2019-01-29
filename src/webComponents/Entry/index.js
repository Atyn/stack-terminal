import FsExtra from 'fs-extra'
import Path from 'path'

const tagName = 'terminal-entry'
export default tagName

// 'var(--default-margin)'

const templates = {
	root: document.createElement('div'),
}

const hostStyle = {
	display:       'flex',
	flexDirection: 'column',
	padding:       'var(--default-margin)',
}

templates.root.style.padding = '10px'

class WebComponent extends HTMLElement {
	constructor() {
		super()
		// this.listener = this.onFileChanged.bind(this)
		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.innerHTML = ''
	}
	async connectedCallback() {
		Object.assign(this.style, hostStyle)
		const id = this.getAttribute('id')
		const workingDirectory = this.getAttribute('working-directory')
		const commandFilePath = Path.resolve(workingDirectory, id, 'command.sh')
		console.log(commandFilePath)
		/*
		const buffer = await FsExtra.readFile(commandFilePath)
		this.shadowRoot.innerHTML = `
			<div>${id}</div>
			<div>${buffer.toString()}</div>
		`
		*/
		
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