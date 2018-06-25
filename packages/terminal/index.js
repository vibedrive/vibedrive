var net = require('net')
var loadConfig = require('./load-config')
var vorpal = require('vorpal')()

const { PORT } = loadConfig()
const CURSOR = `127.0.0.1:${PORT}> `
const namespaces = [
  'tracks',
  'files',
  'folders'
]

var socket

namespaces.forEach(namespace => {
  vorpal
    .command(namespace + ' [commands...]')
    .action(register(namespace))
})

vorpal.delimiter(CURSOR).show()

connect()

function register (namespace) {
  return function (args, done) {
    if (!socket) return this.log('Not connected.')

    socket.once('data', buf => {
      var response = formatResponse(buf.toString())

      this.log(response)
      done()
    })

    var commands = (args.commands || []).join('')
    var msg = `${namespace} ${commands}`

    socket.write(msg)
  }
}

function connect () {
  socket = net.connect({ port: PORT }, onConnect)

  socket.on('error', retry)
  socket.on('end', onEnd)
}

function retry (buf) {
  setTimeout(() => connect(), 1000)
}

function onConnect () {
  vorpal.log('Connected')
}

function onEnd () {
  vorpal.log('Disconnected from server.')

  connect()
}

function formatResponse (str) {
  try {
    var obj = JSON.parse(obj)
    return obj
  } catch (err) {
    return str
  }
}
