const templates = {
	root: document.createElement('div'),
	style: document.createElement('style'),
	title: document.createElement('div'),
	row: document.createElement('div'),
	expandButton: document.createElement('div'),
	circle: document.createElement('div'),
	status: document.createElement('div'),
}

export default templates

Object.assign(templates.expandButton.style, {
	fontWeight: 'bold',
	transition: 'transform 0.6s',
	transform: 'rotate(-180deg)',
})
templates.expandButton.innerHTML =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'

templates.status.appendChild(templates.circle)
templates.circle.classList.add('circle')
templates.expandButton.classList.add('expandButton')
templates.status.classList.add('status')
templates.row.classList.add('row')
templates.title.classList.add('title')

templates.style.innerHTML = css`
	.row {
		display: flex;
		padding: 0 var(--default-margin);
		position: sticky;
		align-items: center;
		top: 0;
		background-color: var(--background-color);
	}
	.circle {
	}
	.row > * {
		padding: var(--default-margin);
		flex-shrink: 1;
	}
	.title {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.status {
	}
	.expandButton {
		cursor: pointer;
		display: flex;
		align-items: center;
		align-self: stretch;
		border-radius: 4px;
	}
	.expandButton:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}
	.expandButton > * {
		margin: -10px 0;
	}
`

Object.assign(templates.status.style, {
	color: 'yellow',
})
Object.assign(templates.circle.style, {
	height: '0.8em',
	width: '0.8em',
	backgroundColor: 'currentColor',
	borderRadius: '50%',
})

function css(strings) {
	return strings
}
