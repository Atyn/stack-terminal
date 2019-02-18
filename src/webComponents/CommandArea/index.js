import FsExtra from 'fs-extra'
import Path from 'path'
import SuggestionGenerator from '../../utils/SuggestionGenerator'
import CommandRunner from '../../utils/CommandRunner'

const tagName = 'terminal-command-area'
export default tagName

const templates = {
	input: document.createElement('input'),
}
const hostStyle = {
	display:       'flex',
	flexDirection: 'column',
	flexShrink:    0,
}
Object.assign(templates.input.style, {
	outline: 'none',
	border:  'none',
	padding: 'calc(2 * var(--default-margin))',
})
templates.input.style['-webkit-appearance'] = 'none'
templates.input.setAttribute('rows', 1)
templates.input.setAttribute('autofocus', true)
templates.input.style.font = 'inherit'
templates.input.style.backgroundColor = 'rgba(255,255,255,0.1)'
templates.input.style.color = 'inherit'

const styleElement = document.createElement('style')
styleElement.innerHTML = `
	button:focus {
		outline: none;
		background-color: rgba(255,255,255,0.1) !important;
	}
`

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.workingDirectory = process.cwd()
		const shadowRoot = this.attachShadow({ mode: 'open' })

		this.elements = {
			cwdElement:        this.getCwdElement(),
			suggestionElement: this.getSuggestionsElement(),
			input:             templates.input.cloneNode(true),
		}
		this.elements.input.setAttribute('tabindex', -1)
		this.elements.input.addEventListener('keydown', (event) => {
			if (event.code === 'Tab') {
				// event.preventDefault()
				// this.elements.suggestionElement.children[0].focus()
			}
		}, { passive: false })
		shadowRoot.addEventListener('keydown', (event) => {
			if (
				event.code === 'Enter' && 
				!event.shiftKey
			) {
				const command = this.elements.input.value
				this.elements.input.value = ''
				this.onCommand(command)
				this.elements.suggestionElement.style.display = 'none'
				/*
				this.dispatchEvent(new CustomEvent('command', {
					detail: input.value,
				}))
				input.value = ''
				*/
			}
		})
		this.elements.input.addEventListener('input', this.onInput.bind(this))
		shadowRoot.appendChild(styleElement.cloneNode(true))
		shadowRoot.appendChild(this.elements.cwdElement)
		shadowRoot.appendChild(this.elements.suggestionElement)
		shadowRoot.appendChild(this.elements.input)
	}
	getCwdElement() {
		const element = document.createElement('div')
		Object.assign(element.style, {
			padding:    'var(--default-margin)',
			color:      '#44ff3b',
			fontWeight: 'bold',
		})
		element.innerText = this.workingDirectory
		return element
	}
	async onInput() {
		const suggestions = await SuggestionGenerator.getSuggestions(
			this.workingDirectory,
			this.elements.input.value
		)
		if (suggestions && suggestions.length) {
			this.elements.suggestionElement.innerHTML = ''
			suggestions
				.map(this.getSuggestionElement.bind(this))
				.forEach(element => this.elements.suggestionElement.appendChild(element))
			this.elements.suggestionElement.style.display = 'flex'
		} else {
			this.elements.suggestionElement.style.display = 'none'
		}
	}
	getSuggestionsElement() {
		const element = document.createElement('ul')
		element.addEventListener('keydown', (event) => {
			if (event.code === 'Enter') {
				event.stopPropagation()
				// this.elements.suggestionElement.children[0].focus()
			}
		})
		Object.assign(element.style, {
			margin:        '0',
			display:       'none',
			flexWrap:      'wrap',
			flexDirection: 'column',
			padding:       'var(--default-margin)',
		})
		return element
	}
	getSuggestionElement(name, index) {
		const element = document.createElement('button')
		Object.assign(element.style, {
			border:          'none',
			display:         'flex',
			margin:          '0',
			padding:         '0',
			backgroundColor: 'initial',
			color:           'currentColor',
			font:            'inherit',
		})
		element.addEventListener('click', (event) => {
			this.onSuggestionClick(name)
		})
		element.setAttribute('tabindex', index)
		element.innerText = name
		return element
	}
	onSuggestionClick(value) {
		this.elements.input.value += value
		this.elements.input.focus()
	}
	async onCommand(command) {
		if (command === 'cd') {
			console.log('command cd - do nothing')
		} else if (command.startsWith('cd ')) {
			const newWorkingDirectory = Path.resolve(
				this.workingDirectory, 
				command.replace('cd ', '')
			)
			console.log(newWorkingDirectory)
			const pathExists = await FsExtra.pathExists(newWorkingDirectory)
			if (pathExists) {
				this.workingDirectory = newWorkingDirectory
				this.elements.cwdElement.innerText = this.workingDirectory
			} else {
				console.warn('Path', pathExists, 'doesnt exists')
			}
			// this.workingDirectory = this.workingDirectory
		} else {
			CommandRunner.run(command, this.workingDirectory)
		}
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