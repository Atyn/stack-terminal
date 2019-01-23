import CommandArea from '../CommandArea/index.js'
import StackArea from '../StackArea/index.js'

const tagName = 'terminal-app'
export default tagName

const hostStyle = {
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
}

const templates = {
	stackArea: document.createElement(StackArea),
	commandArea: document.createElement(CommandArea),
}

templates.stackArea.style.flexGrow = 1

class WebComponent extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' })
		const commandArea = templates.commandArea.cloneNode(true)
		shadowRoot.appendChild(templates.stackArea.cloneNode(true))
		shadowRoot.appendChild(commandArea)
		commandArea.addEventListener('command', (event) => {
			console.log('ON COMMAND', event.detail);
		})
	}
	connectedCallback() {
		Object.assign(this.style, hostStyle)
	}
}
customElements.define(tagName, WebComponent)