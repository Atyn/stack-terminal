const templates = {
	root: document.createElement('div'),
	style: document.createElement('style'),
	title: document.createElement('div'),
	row: document.createElement('div'),
}

export default templates

templates.row.classList.add('row')
templates.title.classList.add('title')

templates.style.innerHTML = `
	.row {
		display: flex;
		padding: var(--default-margin);
		position: sticky;
		align-items: center;
		top: 0;
		background-color: var(--background-color);
	}
	.row > * {
		margin: 0 var(--default-margin);
		flex-shrink: 1;
	}
	.title {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
`
