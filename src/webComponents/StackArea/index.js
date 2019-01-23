const tagName = 'terminal-stack-area'
export default tagName

class WebComponent extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <div>Stack</div>
        `;
	}
}
customElements.define(tagName, WebComponent)