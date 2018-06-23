var path = require('path')
var os = require('os')
var net = require('net')
var level = require('level')

const DB_PATH = path.join(os.homedir(), 'vibedrive/data')
const PORT = 15796

var db = level(DB_PATH)
var server = net.createServer(onConnection)

server.on('error', onError)
server.listen(PORT, onReady)

module.exports = db

function onReady () {
  console.log('vibedb listening on', server.address().port)
}

function onConnection (socket) {
  console.log('connection')
}

function onError (err) {
  throw err
}
