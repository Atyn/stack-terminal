import Entry from '../Entry'
import Debouncer from '../../utils/Debouncer'
import FsExtra from 'fs-extra'
import Templates from './Templates'

const templates = Templates
const tagName = 'terminal-stack-area'

export default tagName

const hostStyle = {
	overflowY: 'hidden',
	overflowX: 'hidden',
	display: 'flex',
	position: 'relative',
	// 'scroll-behavior': 'smooth',
}
const defaultScrollButtonOpacity = 0.8

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.listener = this.onFileChanged.bind(this)
		this.elements = {
			scrollDownButton: templates.scrollDownButton.cloneNode(true),
			style: templates.style.cloneNode(true),
			scrollContainer: templates.scrollContainer.cloneNode(true),
		}
		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.innerHTML = ''
		this.elements.scrollDownButton.addEventListener(
			'click',
			this.scrollToBottom.bind(this)
		)
		shadowRoot.appendChild(this.elements.style)
		shadowRoot.appendChild(this.elements.scrollContainer)
		shadowRoot.appendChild(this.elements.scrollDownButton)
	}
	onFileChanged(changeType, filename) {
		this.list.push(filename) // Keep list in sync
		setTimeout(() => {
			this.addEntryElement(filename)
		}, 200)
	}
	scrollToBottom() {
		setTimeout(() => {
			this.elements.scrollContainer.scrollTop = this.elements.scrollContainer.scrollHeight
		}, 50)
	}
	scrollIsDown() {
		return (
			this.elements.scrollContainer.scrollTop +
				this.elements.scrollContainer.clientHeight ===
			this.elements.scrollContainer.scrollHeight
		)
	}
	onDebouncedScroll() {
		if (this.scrollIsDown()) {
			this.lockedScrollState = true
			this.elements.scrollDownButton.style.opacity = 0
			this.elements.scrollDownButton.style.pointerEvents = 'none'
		} else {
			this.lockedScrollState = false
			this.elements.scrollDownButton.style.opacity = defaultScrollButtonOpacity
			this.elements.scrollDownButton.style.pointerEvents = null
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
		this.elements.scrollContainer.addEventListener(
			'scroll',
			scrollDebouncer.run
		)
		this.shadowRoot.addEventListener(
			'content-added',
			this.onContentAdded.bind(this)
		)
		setTimeout(() => this.scrollToBottom(), 200)
	}
	getScrollDownButton() {}
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
		this.elements.scrollContainer.appendChild(element)
	}
}
customElements.define(tagName, WebComponent)
