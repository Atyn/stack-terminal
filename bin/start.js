#!/usr/bin/env node

const electronPath = require('electron')
const ChildProcess = require('child_process')
const Path = require('path')

const path = process.argv[2]
const cwd = path ?
	Path.resolve(process.cwd(), path) :
	process.cwd()

ChildProcess.spawn(
	electronPath, [Path.resolve(__dirname, '../electron-apps', 'production'),
	], {
		cwd,
		// detached: true,
		stdout: 'pipe',
		stdin:  'pipe',
		stderr: 'pipe',
	})
