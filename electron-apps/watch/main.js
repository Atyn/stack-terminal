const { app, BrowserWindow } = require('electron')
const FsExtra = require('fs-extra')

function createWindow() {
	const win = new BrowserWindow({ width: 800, height: 600 })
	win.setMenu(null)
	win.setAutoHideMenuBar(true)
	win.loadFile('index.html')
}

app.on('ready', createWindow)