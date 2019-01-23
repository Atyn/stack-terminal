const tagName = 'terminal-command-area'
export default tagName

const templates = {
	input: document.createElement('input'),
}

templates.form.appendChild(templates.input)
templates.form.style.display = 'flex'
templates.form.style.flexDirection = 'column'
templates.input.style.padding = '5px'

const hostStyle = {
	display: 'flex',
	flexDirection: 'column',
}

class WebComponent extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });
		const input = templates.input.cloneNode(true)
		input.addEventListener('keydown', (event) => {
			if(event.code === 'Enter') {
				this.dispatchEvent(new CustomEvent('command', {
					detail: input.value
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