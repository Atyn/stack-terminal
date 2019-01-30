import Entry from '../Entry'
import FsExtra from 'fs-extra'

const tagName = 'terminal-stack-area'

export default tagName

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.listener = this.onFileChanged.bind(this)
		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.innerHTML = ''
	}
	onFileChanged(changeType, filename) {
		this.list.push(filename) // Keep list in sync
		setTimeout(() => {
			this.addEntryElement(filename)
		}, 200)
	}
	async connectedCallback() {
		this.style.overflowY = 'scroll'
		const workingDirectory = this.getAttribute('working-directory')
		this.workingDirectory = workingDirectory
		this.watcher = FsExtra.watch(workingDirectory, this.listener)
		const unsortedList = await FsExtra.readdir(workingDirectory)
		const list = unsortedList.sort((a, b) => Number(a) - Number(b))
		this.list = list
		list.forEach(this.addEntryElement.bind(this))
	}
	addEntryElement(id) {
		const element = document.createElement(Entry)
		element.setAttribute('working-directory', this.workingDirectory)
		element.setAttribute('id', id)
		this.shadowRoot.appendChild(element)
	}
}
customElements.define(tagName, WebComponent)