const templates = {
	scrollDownButton: document.createElement('div'),
	style: document.createElement('style'),
	scrollContainer: document.createElement('div'),
}

export default templates

templates.scrollDownButton.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
		<path fill="none" d="M0 0h24v24H0V0z"/>
	</svg>
`
const defaultScrollButtonOpacity = 0.8

templates.style.innerHTML = /* css */ `
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
`

templates.scrollContainer.classList.add('scrollContainer')

Object.assign(templates.scrollContainer.style, {
	overflowY: 'scroll',
	overflowX: 'hidden',
	display: 'flex',
	position: 'relative',
	flexDirection: 'column',
})

Object.assign(templates.scrollDownButton.style, {
	position: 'absolute',
	backgroundColor: 'black',
	color: 'white',
	borderRadius: '50%',
	left: '47%',
	opacity: defaultScrollButtonOpacity,
	padding: 'var(--default-margin)',
	bottom: 'var(--default-margin)',
	transition: 'opacity 0.6s',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
})
