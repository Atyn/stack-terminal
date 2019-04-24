const templates = {
	inputHolder: document.createElement('div'),
	input: document.createElement('input'),
	root: document.createElement('div'),
	sendButton: document.createElement('div'),
	style: document.createElement('style'),
	scrollContainer: document.createElement('ul'),
}

export default templates

templates.style.innerHTML = `
	.scrollContainer {
		scroll-behavior: smooth;
	}
	.scrollContainer::-webkit-scrollbar {
		width: 0.5em;
	}
	.scrollContainer::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
	}
	.scrollContainer::-webkit-scrollbar-thumb {
		background-color: var(--secondary-color);
		outline: 1px solid red;
		border-radius: 6px;
	}
	button {
		cursor: pointer;
		flex-shrink: 0;
	}
	button:hover,
	button:focus {
		outline: none;
		background-color: rgba(255, 255, 255, 0.1) !important;
	}
	pre {
		font-family: inherit;
		margin: 0;
		flex-shrink: 0;
	}
	.sendButton {

	}
`

templates.scrollContainer.classList.add('scrollContainer')
Object.assign(templates.scrollContainer.style, {
	margin: '0',
	display: 'none',
	flexDirection: 'column',
	padding: 'var(--default-margin)',
	overflowY: 'scroll',
	overflowX: 'hidden',
	flexShrink: 0,
	maxHeight: '400px',
})

Object.assign(templates.sendButton.style, {
	outline: 'none',
	border: 'none',
	flexShrink: 0,
	backgroundColor: 'rgba(0,0,0,0)',
	display: 'flex',
	color: 'inherit',
	cursor: 'pointer',
	alignItems: 'center',
	justifyContent: 'center',
	padding: 'var(--default-margin)',
})
Object.assign(templates.inputHolder.style, {
	flexShrink: 0,
	backgroundColor: 'rgba(255,255,255,0.1)',
	display: 'flex',
})
Object.assign(templates.input.style, {
	outline: 'none',
	border: 'none',
	padding: 'calc(2 * var(--default-margin))',
	flexShrink: 0,
	backgroundColor: 'rgba(0,0,0,0)',
	flexGrow: 1,
	font: 'inherit',
	color: 'inherit',
})
Object.assign(templates.root.style, {
	display: 'flex',
	flexDirection: 'column',
	maxHeight: '100%',
	flexShrink: 0,
})

templates.input.style['-webkit-appearance'] = 'none'
templates.input.setAttribute('rows', 1)
templates.input.setAttribute('autofocus', true)
templates.sendButton.title = 'execute command'
