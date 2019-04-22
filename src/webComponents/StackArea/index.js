import Entry from '../Entry'
import Debouncer from '../../utils/Debouncer'
import FsExtra from 'fs-extra'

const tagName = 'terminal-stack-area'
const hostStyle = {
	overflowY: 'hidden',
	overflowX: 'hidden',
	display: 'flex',
	position: 'relative',
	// 'scroll-behavior': 'smooth',
}
const mutationObserverConfig = {
	childList: true,
	subtree: true,
}
const lockStateStyle = {
	position: 'absolute',
	right: '10px',
	bottom: '10px',
}
const scrollContainerStyle = {
	overflowY: 'scroll',
	overflowX: 'hidden',
	display: 'flex',
	position: 'relative',
	flexDirection: 'column',
}

export default tagName

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.listener = this.onFileChanged.bind(this)
		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.innerHTML = ''
		this.scrollContainer = document.createElement('div')
		Object.assign(this.scrollContainer.style, scrollContainerStyle)
		shadowRoot.appendChild(this.scrollContainer)
	}
	onFileChanged(changeType, filename) {
		this.list.push(filename) // Keep list in sync
		setTimeout(() => {
			this.addEntryElement(filename)
		}, 200)
	}
	scrollToBottom() {
		setTimeout(() => {
			this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
		}, 50)
	}
	scrollIsDown() {
		return (
			this.scrollContainer.scrollTop + this.scrollContainer.clientHeight ===
			this.scrollContainer.scrollHeight
		)
	}
	onDebouncedScroll() {
		if (this.scrollIsDown()) {
			this.lockedScrollState = true
		} else {
			this.lockedScrollState = false
		}
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
		const scrollDebouncer = new Debouncer(
			this.onDebouncedScroll.bind(this),
			100
		)
		this.scrollContainer.addEventListener('scroll', scrollDebouncer.run)
		this.shadowRoot.addEventListener(
			'content-added',
			this.onContentAdded.bind(this)
		)
		setTimeout(() => this.scrollToBottom(), 200)
	}
	onContentAdded() {
		if (this.lockedScrollState) {
			this.scrollToBottom()
		}
	}
	addEntryElement(id) {
		const element = document.createElement(Entry, { id })
		element.setAttribute('working-directory', this.workingDirectory)
		element.setAttribute('id', id)
		element.style.flexShrink = 0
		this.scrollContainer.appendChild(element)
	}
}
customElements.define(tagName, WebComponent)
