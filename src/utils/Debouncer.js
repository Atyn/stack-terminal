export default class {
	constructor(fun, time = 200) {
		this.timer = null
		this.time = time
		this.fun = fun
		this.run = () => {
			clearTimeout(this.timer)
			this.timer = setTimeout(this.fun, this.time)
		}
	}
}
