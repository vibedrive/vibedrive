/*
 *  Vibedrive v0.8
 *
 */

require('update-electron-app')({
  repo: 'vibedrive/releases'
})

var server = require('./server')

var path = require('path')
var { app, BrowserWindow, Menu, shell } = require('electron')

const INDEX_URL = 'http://localhost:8080' // path.join('file://', __dirname, '../dist/index.html')
const ICON_PATH = path.join(__dirname, 'assets/64.png')
const WIDTH = 1100
const HEIGHT = 710

var mainWindow = null

app.on('ready', onReady)
app.on('window-all-closed', onWindowsClosed)

function onReady () {
  server.on('ready', () => {
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

  console.log(INDEX_URL)

  mainWindow.loadURL(INDEX_URL)

  process.env.NODE_ENV !== 'production' && mainWindow.openDevTools()

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

function isMac () {
  return process.platform === 'darwin'
}

function isLinux () {
  return process.platform === 'linux'
}

function isWindows () {
  return process.platform === 'win32'
}
