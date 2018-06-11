require('./lib/absolute')(__dirname)

var http = require('http')
var socketIO = require('socket.io')
var ss = require('socket.io-stream')
var EventEmitter = require('events')

var folders = require('@/handlers/folders')
var files = require('@/handlers/files')
var plugins = require('@/handlers/plugins')

const { PORT } = require('@/constants')

var server = new EventEmitter()

server.start = start

module.exports = server

function start () {
  var server = http.Server()
  var io = socketIO(server)

  io.on('connection', function (socket) {
    console.log('Connected to the browser.')

    socket.on('traktor:locate', plugins.traktor.locate)
    socket.on('folders:clean', folders.clean)
    socket.on('folders:list', folders.list)
    socket.on('files:info', files.info)
    socket.on('files:trash', files.trash)
    socket.on('files:import', files.import)
    socket.on('files:finish-import', files.finishImporting)
    ss(socket).on('files:buffer', files.buffer)
  })

  server.listen(PORT, () => {
    console.log('Vibedrive File Server listening on', PORT)
    this.emit('ready')
  })
}
