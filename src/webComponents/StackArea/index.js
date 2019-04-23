import Entry from '../Entry'
import Debouncer from '../../utils/Debouncer'
import FsExtra from 'fs-extra'

const tagName = 'terminal-stack-area'
const templates = {
	scrollDownButton: document.createElement('div'),
}
templates.scrollDownButton.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
		<path fill="none" d="M0 0h24v24H0V0z"/>
	</svg>
`
const hostStyle = {
	overflowY: 'hidden',
	overflowX: 'hidden',
	display: 'flex',
	position: 'relative',
	// 'scroll-behavior': 'smooth',
}
const defaultScrollButtonOpacity = 0.8
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

Object.assign(templates.scrollDownButton.style, {
	position: 'absolute',
	backgroundColor: 'black',
	color: 'white',
	borderRadius: '50%',
	left: '47%',
	opacity: defaultScrollButtonOpacity,
	padding: 'var(--default-margin)',
	bottom: 'var(--default-margin)',
	transition: 'opacity 0.6s',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
})

export default tagName

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.listener = this.onFileChanged.bind(this)
		this.elements = {
			scrollDownButton: templates.scrollDownButton.cloneNode(true),
		}
		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.innerHTML = ''
		this.scrollContainer = document.createElement('div')
		this.elements.scrollDownButton.addEventListener(
			'click',
			this.scrollToBottom.bind(this)
		)
		Object.assign(this.scrollContainer.style, scrollContainerStyle)
		shadowRoot.appendChild(this.scrollContainer)
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
		this.scrollContainer.addEventListener('scroll', scrollDebouncer.run)
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
		this.scrollContainer.appendChild(element)
	}
}
customElements.define(tagName, WebComponent)
