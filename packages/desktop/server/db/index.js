var path = require('path')
var os = require('os')
var net = require('net')
var level = require('level')
var pkg = require('../../../package.json')

var tracks = require('./tracks')

const DB_PATH = path.join(os.homedir(), 'vibedrive/data')
const PORT = 15796
const USAGE = `
${pkg.name} ${pkg.version}

To get help about Vibedrive commands type:

  "help <command>" for help on <command>
  "quit" to exit
`

var db = Object.assign(level(DB_PATH), tracks)
var server = net.createServer(onConnection)

server.on('error', onError)
server.listen(PORT, onReady)

module.exports = db

function onReady () {
  console.log('vibedb listening on', server.address().port)
}

function onConnection (socket) {
  socket.on('data', function (buf) {
    var msg = buf.toString().split(' ')
    var cmd = msg[0]

    switch (cmd) {
      case 'help':
        socket.write(USAGE)
        break

      default:
        socket.write(`(error) ERR unknown command '${cmd}'`)
        break
    }
  })
}

function onError (err) {
  throw err
}
