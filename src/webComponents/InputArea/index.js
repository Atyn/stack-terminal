const tagName = 'terminal-input-area'
export default tagName

const templates = {
	input: document.createElement('input'),
}
const hostStyle = {
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
}
Object.assign(templates.input.style, {
	outline: 'none',
	border: 'none',
	padding: 'calc(2 * var(--default-margin))',
})
templates.input.style['-webkit-appearance'] = 'none'
templates.input.setAttribute('rows', 1)
templates.input.setAttribute('autofocus', true)
templates.input.style.font = 'inherit'
templates.input.style.backgroundColor = 'var(--secondary-color)'
templates.input.style.color = 'inherit'

class WebComponent extends HTMLElement {
	constructor() {
		super()
		const shadowRoot = this.attachShadow({ mode: 'open' })
		const input = templates.input.cloneNode(true)
		shadowRoot.addEventListener('keydown', event => {
			if (event.code === 'Enter' && !event.shiftKey) {
				this.dispatchEvent(
					new CustomEvent('command', {
						detail: input.value,
					})
				)
				input.value = ''
			}
		})
		this.input = input
		shadowRoot.appendChild(input)
	}
	focus() {
		this.input.focus()
		console.log('focus')
	}
	connectedCallback() {
		Object.assign(this.style, hostStyle)
	}
}

customElements.define(tagName, WebComponent)
