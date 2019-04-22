import LockElement from './LockElement'

const tagName = 'terminal-lock-state'
export default tagName

const templates = {
	input: document.createElement('input'),
}
const hostStyle = {
	/*
	display: 'flex',
	flexDirection: 'column',
    flexShrink: 0,
    */
}
Object.assign(templates.input.style, {
	outline: 'none',
	border: 'none',
	padding: 'calc(2 * var(--default-margin))',
})

class WebComponent extends HTMLElement {
	constructor() {
		super()
		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.appendChild(LockElement.getElement())
	}
	connectedCallback() {
		Object.assign(this.style, hostStyle)
	}
}

customElements.define(tagName, WebComponent)
