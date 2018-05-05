var io = require('socket.io-client')
var promisify = require('util-promisify')

const platform = 'browser'

class FileServerService {
  constructor () {
    this.connected = false

    this.files = {
      list: this.listFiles.bind(this)
    }
  }

  connect () {
    return new Promise((resolve, reject) => {
      if (platform === 'electron') return reject()

      this.socket = io('http://localhost:9753')
      this.emit = promisify(socket.emit).bind(socket)

      this.socket.on('connect', () => {
        this.connected = true
        resolve()
      })
    })
  }

  listFiles () {
    return this.emit('folders:inbox:list')
  }
}

export default new FileServerService()
