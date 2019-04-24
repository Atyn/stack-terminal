const templates = {
	inputHolder: document.createElement('div'),
	input: document.createElement('input'),
	root: document.createElement('div'),
	sendButton: document.createElement('button'),
}

export default templates

Object.assign(templates.sendButton.style, {
	outline: 'none',
	border: 'none',
	flexShrink: 0,
	backgroundColor: 'rgba(0,0,0,0)',
	display: 'flex',
	color: 'inherit',
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
