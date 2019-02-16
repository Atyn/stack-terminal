import FsExtra from 'fs-extra'
import Path from 'path'
import { read } from 'fs'

export default {
	sync(filepath, callback) {
		const filename = Path.basename(filepath)
		const watcher = FsExtra.watch(Path.dirname(filepath), onChange)
		setTimeout(firstRead, 1)
		return {
			// TODO: implement pause
			pause() {

			},
			close() {
				watcher.close()
			},
		}
		async function onChange(type, _filename) {
			if (_filename === filename) {
				read()
			}
		}
		async function firstRead() {
			const exists = await FsExtra.exists(filepath)
			if (exists) {
				read()
			}
		}
		async function read() {
			const buffer = await FsExtra.readFile(filepath)
			callback(buffer.toString())
		}
	},
}
