var net = require('net')
var loadConfig = require('./load-config')

const { PORT } = loadConfig()
const EXIT_COMMANDS = [ 'quit', 'exit', '.exit', 'q' ]

var socket = net.connect({ port: PORT }, onConnect)

function onConnect () {
  const CURSOR = `127.0.0.1:${PORT}> `

  process.stdout.write(CURSOR)

  process.stdin.on('data', function (buf) {
    var msg = buf.toString().replace('\n', '')

    if (EXIT_COMMANDS.includes(msg)) {
      return process.exit(0)
    }

    socket.write(msg)
  })

  socket.on('data', buf => {
    process.stdout.write(buf.toString())
    process.stdout.write('\n' + CURSOR)
  })

  socket.on('end', () => {
    console.log('Disconnected from server')
    process.exit(0)
  })
}
