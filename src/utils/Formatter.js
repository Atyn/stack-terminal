export default {
	format(str) {
		return str
			.replace(/^\s+/gm, '')
			.replace(/\s+/gm, ' ')
	},
}