var io = require('socket.io-client')
var promisify = require('util-promisify')

const platform = 'browser'

class FileServerService {
  constructor () {
    this.promiseOfConnection = null

    this.files = {
      list: this.listFiles.bind(this)
    }

    this._connect()
  }

  _connect () {
    this.promiseOfConnection = new Promise((resolve, reject) => {
      if (this.connected) return resolve()
      if (platform === 'electron') return reject(new Error('Wrong platform.'))

      this.socket = io('http://localhost:9753')

      this.socket.on('connect', () => {
        resolve()
      })

      this.emit = promisify(this.socket.emit).bind(this.socket)
    })
  }

  delay (cb) {
    if (this.socket.connected) return Promise.resolve()

    return this.promiseOfConnection
  }

  cleanInbox () {
    return this.delay().then(() => this.emit('folders:inbox:clean'))
  }

  listFiles () {
    return this.delay().then(() => this.emit('folders:inbox:list'))
  }
}

export default new FileServerService()
