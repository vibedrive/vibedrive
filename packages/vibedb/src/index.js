var path = require('path')
var os = require('os')
var net = require('net')
var level = require('level')
var pkg = require('../package.json')

var tracks = require('./tracks')

const DB_PATH = path.join(os.homedir(), 'vibedrive/data')
const PORT = 15796
const USAGE = `
${pkg.name} ${pkg.version}

To get help about Vibedrive commands type:

  "help <command>" for help on <command>
  "quit" to exit
`

var vibedb = { db: level(DB_PATH) }

vibedb.tracks = {}

Object.keys(tracks).forEach(key => {
  vibedb.tracks[key] = tracks[key].bind(vibedb)
})

var server = net.createServer(onConnection)

server.on('error', onError)
server.listen(PORT, onReady)

module.exports = vibedb

function onReady () {
  console.log(`${pkg.name} listening on ${server.address().port}`)
}

function onConnection (socket) {
  socket.on('data', function (buf) {
    var msg = buf.toString().split(' ')
    var namespace = msg[0]
    var cmd = msg[1]

    if (namespace === 'help') {
      return socket.write(USAGE)
    }

    if (namespace === 'tracks') {
      if (cmd === 'list') {
        return vibedb.tracks.list((err, tracks) => {
          if (err) return socket.write('Unexpected error.')

          socket.write(JSON.stringify(tracks))
        })
      }

      return socket.write(namespace + ' - possible commands: "list" ')
    }

    socket.write(`(error) ERR unknown namespace '${namespace}'`)
  })
}

function onError (err) {
  throw err
}
