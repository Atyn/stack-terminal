#!/usr/bin/env node

const electronPath = require('electron')
const ChildProcess = require('child_process')
const Path = require('path')

const command = [
	electronPath,
	Path.resolve(__dirname, 'electron-apps', 'production'),
].join(' ')

ChildProcess.exec(command, { stdout: 'pipe' })
