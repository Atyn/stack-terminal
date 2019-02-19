import Entry from '../Entry'
import FsExtra from 'fs-extra'

const tagName = 'terminal-stack-area'
const hostStyle = {
	overflowY: 'scroll',
	overflowX: 'hidden',
	display:   'flex',
	// 'scroll-behavior': 'smooth',
}
const mutationObserverConfig = {
	childList: true, 
	subtree:   true,
}

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
	onDomChange() {
		this.scrollToBottom()
	}
	scrollToBottom() {
		setTimeout(() => {
			this.scrollTop = this.scrollHeight
		}, 50)
	}
	startObservingChanges() {
		const observer = new MutationObserver(this.onDomChange.bind(this))
		observer.observe(this.shadowRoot, mutationObserverConfig)
	}
	onScroll(event) {
		// console.log('scroll', event)
	}
	async connectedCallback() {
		Object.assign(this.style, hostStyle)
		const workingDirectory = this.getAttribute('working-directory')
		this.workingDirectory = workingDirectory
		this.watcher = FsExtra.watch(workingDirectory, this.listener)
		const unsortedList = await FsExtra.readdir(workingDirectory)
		const list = unsortedList.sort((a, b) => Number(a) - Number(b))
		this.list = list
		list.forEach(this.addEntryElement.bind(this))
		this.addEventListener('scroll', this.onScroll.bind(this))
		this.startObservingChanges()
		setTimeout(
			() => this.scrollToBottom(),
			200
		)
	}
	addEntryElement(id) {
		const element = document.createElement(Entry, { id })
		element.setAttribute('working-directory', this.workingDirectory)
		element.setAttribute('id', id)
		element.style.flexShrink = 0
		this.shadowRoot.appendChild(element)
	}
}
customElements.define(tagName, WebComponent)