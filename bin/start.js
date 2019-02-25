#!/usr/bin/env node

const electronPath = require('electron')
const ChildProcess = require('child_process')
const Path = require('path')

ChildProcess.spawn(
	electronPath, [Path.resolve(__dirname, '../electron-apps', 'production'),
	], {
		// detached: true,
		stdout: 'pipe',
		stdin:  'pipe',
		stderr: 'pipe',
	})
