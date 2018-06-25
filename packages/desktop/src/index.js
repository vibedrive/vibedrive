/*
 *  Vibedrive Desktop
 *
 */

require('update-electron-app')({
  repo: 'vibedrive/vibedrive'
})

var request = require('request')
var server = require('./server')
var isDev = require('electron-is-dev')

var path = require('path')
var { app, BrowserWindow, Menu, shell, globalShortcut } = require('electron')

const SPLASH_URL = isDev
  ? 'file://' + path.join(__dirname, '../public/splash.html')
  : 'file://' + path.join(__dirname, '../splash.html')

const INDEX_URL = isDev
  ? 'http://localhost:8080'
  : 'file://' + path.join(__dirname, 'client/index.html')

const ICON_PATH = path.join(__dirname, 'assets/64.png')
const WIDTH = 945
const HEIGHT = 645

var mainWindow = null
var splashScreen = null

app.on('ready', onReady)
app.on('window-all-closed', onWindowsClosed)

function onReady () {
  createSplashScreen(() => {
    server.on('ready', () => {
      if (isDev) {
        var opts = { method: 'get', url: INDEX_URL }
        var timer = setInterval(ping, 1000)
      } else {
        openMainWindow()
      }

      function ping () {
        request(opts, (err, res, body) => {
          if (!err && timer && body && body.includes('<script type="text/javascript"')) {
            clearInterval(timer)
            timer = null
            openMainWindow()
          }
        })
      }
    })

    server.start()
  })

  globalShortcut.register('CmdOrCtrl+Shift+I', () => {
    if (splashScreen) splashScreen.toggleDevTools()
    if (mainWindow) mainWindow.toggleDevTools()
  })

  globalShortcut.register('CmdOrCtrl+R', () => {
    if (splashScreen) splashScreen.reload()
    if (mainWindow) mainWindow.reload()
  })
}

function openMainWindow () {
  createWindow()
  createMenu()
  splashScreen.close()
}

function onWindowsClosed () {
  app.quit()
}

function createSplashScreen (callback) {
  splashScreen = new BrowserWindow({
    show: false,
    title: 'Vibedrive',
    frame: false,
    width: 1100 / 2,
    height: 710 / 2,
    minWidth: 500,
    minHeight: 400,
    focusable: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    acceptFirstMouse: true,
    icon: ICON_PATH,
    webPreferences: {
      zoomFactor: 1
    }
  })

  splashScreen.loadURL(SPLASH_URL)

  splashScreen.once('ready-to-show', () => {
    splashScreen.show()
    callback()
  })

  splashScreen.on('closed', () => {
    splashScreen = null
  })

  return splashScreen
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
