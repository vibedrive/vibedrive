var net = require('net')

const PORT = 15796

var client = net.connect({ port: PORT }, onConnect)

function onConnect () {
  process.stdout.write('> ')

  client.on('data', () => {
    console.log('data!')
  })

  client.on('end', () => {
    console.log('disconnected from server')
  })
}
