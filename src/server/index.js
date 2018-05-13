require('./lib/absolute')(__dirname)

var http = require('http')
var socketIO = require('socket.io')
var ss = require('socket.io-stream')

var folders = require('@/handlers/folders')
var files = require('@/handlers/files')
var plugins = require('@/handlers/plugins')

const { PORT, DIRECTORY } = require('@/constants')

var server = http.Server()
var io = socketIO(server)

io.on('connection', function (socket) {
  console.log('Connected to the browser.')

  socket.on('traktor:locate', plugins.traktor.locate)
  socket.on('folders:clean', folders.clean)
  socket.on('folders:list', folders.list)
  socket.on('files:info', files.info)
  socket.on('files:trash', files.trash)
  ss(socket).on('files:buffer', files.buffer)
})

server.listen(PORT, function () {
  console.log('Vibedrive File Server listening on', PORT)
})
