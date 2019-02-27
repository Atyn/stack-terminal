const { app, BrowserWindow } = require('electron')
const Path = require('path')

function createWindow() {
	const win = new BrowserWindow({ 
		icon:   Path.resolve(__dirname, '../../icon.svg'),
		width:  800, 
		height: 600, 
	})
	win.setMenu(null)
	win.setAutoHideMenuBar(true)
	win.loadFile('index.html')
}

app.on('ready', createWindow)