import FsExtra from 'fs-extra'
import Path from 'path'
import SuggestionGenerator from '../../utils/SuggestionGenerator'
import CommandRunner from '../../utils/CommandRunner'
import Searcher from '../../utils/Searcher'
import IdTracker from '../../utils/IdTracker'
import Formatter from '../../utils/Formatter'
import Os from 'os'
import Templates from './Templates'

const templates = Templates
const tagName = 'terminal-command-area'
export default tagName

class WebComponent extends HTMLElement {
	constructor() {
		super()
		this.workingDirectory = process.cwd()
		const shadowRoot = this.attachShadow({ mode: 'open' })
		this.elements = {
			cwdElement: this.getCwdElement(),
			suggestionElement: this.getSuggestionsElement(),
			input: templates.input.cloneNode(true),
			rootElement: templates.root.cloneNode(true),
			inputHolder: templates.inputHolder.cloneNode(true),
			sendButton: this.getSendButtonElement(),
			style: Templates.style.cloneNode(true),
		}
		this.elements.input.setAttribute('tabindex', -1)
		this.elements.input.addEventListener(
			'keydown',
			event => {
				if (event.code === 'Tab') {
					// event.preventDefault()
					// this.elements.suggestionElement.children[0].focus()
				}
			},
			{ passive: false }
		)
		this.searchObject = {
			command: '',
			index: null,
		}
		shadowRoot.addEventListener('keydown', this.onKeyDown.bind(this))
		this.elements.input.addEventListener('input', this.onInput.bind(this))
		shadowRoot.appendChild(this.elements.style)
		shadowRoot.appendChild(this.elements.rootElement)
		this.elements.inputHolder.appendChild(this.elements.input)
		this.elements.inputHolder.appendChild(this.elements.sendButton)
		this.elements.rootElement.appendChild(this.elements.cwdElement)
		this.elements.rootElement.appendChild(this.elements.cwdElement)
		this.elements.rootElement.appendChild(this.elements.suggestionElement)
		this.elements.rootElement.appendChild(this.elements.inputHolder)
	}
	submit() {
		const command = this.elements.input.value
		this.searchObject.index = null
		this.elements.input.value = ''
		this.onCommand(command)
		this.elements.suggestionElement.style.display = 'none'
	}
	async onKeyDown(event) {
		if (event.code === 'Enter' && !event.shiftKey) {
			this.submit()
		} else if (event.code === 'F5') {
			this.elements.input.value += Os.homedir()
		} else if (event.code === 'KeyU' && event.ctrlKey) {
			this.elements.input.value = ''
		} else if (event.code === 'ArrowUp') {
			event.preventDefault()
			if (this.searchObject.index === null) {
				this.searchObject.command = this.elements.input.value
				this.searchObject.index = Number(IdTracker.getHighestId()) + 1
			}
			const results = await Searcher.find({
				fromIndex: this.searchObject.index - 1,
				onCommand: (text, index) =>
					text.startsWith(this.searchObject.command)
						? { index, value: text }
						: null,
			})
			if (results) {
				this.searchObject.index = results.index
				this.elements.input.value = results.value
			}
		} else if (event.code === 'ArrowDown' && this.searchObject.index !== null) {
			const results = await Searcher.find({
				fromIndex: this.searchObject.index + 1,
				toIndex: Number(IdTracker.getHighestId()),
				onCommand: (text, index) =>
					text.startsWith(this.searchObject.command)
						? { index, value: text }
						: null,
			})
			if (results) {
				this.searchObject.index = results.index
				this.elements.input.value = results.value
			}
		}
	}
	getCwdElement() {
		const element = document.createElement('div')
		Object.assign(element.style, {
			padding: 'var(--default-margin)',
			color: '#44ff3b',
			fontWeight: 'bold',
		})
		element.innerText = this.workingDirectory
		return element
	}
	async onInput() {
		this.elements.input.value = Formatter.format(this.elements.input.value)
		const suggestions = await SuggestionGenerator.getSuggestions(
			this.workingDirectory,
			this.elements.input.value
		)
		if (suggestions && suggestions.length) {
			this.elements.suggestionElement.innerHTML = ''
			suggestions
				.map(this.getSuggestionElement.bind(this))
				.forEach(element =>
					this.elements.suggestionElement.appendChild(element)
				)
			this.elements.suggestionElement.style.display = 'flex'
		} else {
			this.elements.suggestionElement.style.display = 'none'
		}
	}
	getSuggestionsElement() {
		const element = Templates.scrollContainer.cloneNode(true)
		element.addEventListener('keydown', event => {
			switch (event.code) {
				case 'Backspace':
				case 'Escape':
					this.elements.input.focus()
					break
			}
			if (event.code === 'ArrowDown') {
				// focus next
				console.log(event)
				console.log(document.activeElement)
				const selectedElement = event.path[0]
			}
			if (event.code === 'ArrowUp') {
				// focus next
				console.log(event)
			}
			if (event.code === 'Enter') {
				event.stopPropagation()
				// this.elements.suggestionElement.children[0].focus()
			}
		})

		return element
	}
	getSuggestionElement(suggestionObject, index) {
		const element = document.createElement('button')
		if (suggestionObject.prefix) {
			const prefixElement = document.createElement('pre')
			prefixElement.style.opacity = '0.5'
			prefixElement.innerHTML = suggestionObject.prefix
			element.appendChild(prefixElement)
		}
		const valueElement = document.createElement('pre')
		element.appendChild(valueElement)
		valueElement.innerHTML = suggestionObject.value
		if (suggestionObject.description) {
			const descriptionElement = document.createElement('pre')
			descriptionElement.innerHTML = suggestionObject.description
			element.appendChild(descriptionElement)
		}
		Object.assign(element.style, {
			border: 'none',
			display: 'flex',
			margin: '0',
			padding: '0',
			backgroundColor: 'initial',
			color: 'currentColor',
			font: 'inherit',
			flexShrink: 0,
		})
		element.addEventListener('click', event => {
			this.onSuggestionClick(suggestionObject.value)
		})
		element.setAttribute('tabindex', index + 2)
		return element
	}
	onSuggestionClick(value) {
		this.elements.input.value += value
		this.elements.input.focus()
		this.onInput()
	}
	getSendButtonElement() {
		const element = templates.sendButton.cloneNode(true)
		element.addEventListener('click', () => {
			this.submit()
		})
		element.innerHTML = `<svg
			xmlns="http://www.w3.org/2000/svg" 
			width="24" height="24" viewBox="0 0 24 24">
			<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
			<path d="M0 0h24v24H0z" 
			fill="none"/>
		</svg>`
		return element
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
		this.elements.input.focus()
	}
	/*
	connectedCallback() {
		Object.assign(this.style, hostStyle)
	}
	*/
}

customElements.define(tagName, WebComponent)
