const tagName = 'terminal-command-area'
export default tagName

const templates = {
	input: document.createElement('input'),
}

templates.input.style.padding = 'calc(2 * var(--default-margin))'
templates.input.style.border = 'none'
templates.input.style['-webkit-appearance'] = 'none'
templates.input.setAttribute('rows', 1)
templates.input.setAttribute('autofocus', true)
templates.input.style.font = 'inherit'
templates.input.style.backgroundColor = 'rgba(255,255,255,0.1)'
templates.input.style.color = 'inherit'

const hostStyle = {
	display:       'flex',
	flexDirection: 'column',
	flexShrink:    0,
}

class WebComponent extends HTMLElement {
	constructor() {
		super()
		const shadowRoot = this.attachShadow({ mode: 'open' })
		const input = templates.input.cloneNode(true)
		shadowRoot.addEventListener('keydown', (event) => {
			if (
				event.code === 'Enter' && 
				!event.shiftKey
			) {
				this.dispatchEvent(new CustomEvent('command', {
					detail: input.value,
				}))
				input.value = ''
			}
		})
		shadowRoot.appendChild(input)
	}
	connectedCallback() {
		Object.assign(this.style, hostStyle)
	}
}

customElements.define(tagName, WebComponent)