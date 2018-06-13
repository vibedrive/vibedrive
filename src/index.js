/*
 *  Vibedrive v0.8
 *
 */

require('update-electron-app')({
  repo: 'vibedrive/releases'
})

var server = require('./server')
var isDev = require('electron-is-dev')

var path = require('path')
var { app, BrowserWindow, Menu, shell, globalShortcut } = require('electron')

const INDEX_URL = isDev
  ? 'http://localhost:8080'
  : 'file://' + path.join(__dirname, 'client/index.html')
const ICON_PATH = path.join(__dirname, 'assets/64.png')
const WIDTH = 1100
const HEIGHT = 710

var mainWindow = null

app.on('ready', onReady)
app.on('window-all-closed', onWindowsClosed)

function onReady () {
  server.on('ready', () => {
    createWindow()
    createMenu()
  })

  server.start()
}

function onWindowsClosed () {
  app.quit()
}

function createWindow () {
  mainWindow = new BrowserWindow({
    title: 'Vibedrive',
    width: WIDTH,
    height: HEIGHT,
    minWidth: 500,
    minHeight: 400,
    acceptFirstMouse: true,
    icon: ICON_PATH,
    webPreferences: {
      zoomFactor: 1
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.loadURL(INDEX_URL)

  globalShortcut.register('CmdOrCtrl+Shift+I', () => {
    mainWindow.toggleDevTools()
  })

  if (isDev) {
    mainWindow.openDevTools()
  }

  return mainWindow
}

function createMenu () {
  var applicationMenu = {
    label: 'Application',
    submenu: [{
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => app.quit()
    }]
  }

  var helpMenu = {
    label: 'Help',
    role: 'help',
    id: 'help',
    submenu: [
      {
        label: 'Show App Data Folder',
        click: (menuItem, window, e) => {
          var directory = app.getPath('userData')

          shell.showItemInFolder(directory)
        }
      },
      {
        label: 'Vibedrive Help',
        accelerator: 'CmdOrCtrl+/',
        click: () => {
          shell.openExternal('https://help.vibedrive.app')
        }
      }
    ]
  }

  var template = [
    applicationMenu,
    helpMenu
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
