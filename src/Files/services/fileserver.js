var io = require('socket.io-client')
var ss = require('socket.io-stream')
var promisify = require('util-promisify')

const platform = 'browser'

class FileServerService {
  constructor () {
    this.promiseOfConnection = null

    this.files = {
      list: this.listFiles.bind(this),
      trash: this.trashFile.bind(this),
      buffer: this.bufferFile.bind(this)
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

  trashFile (folder, filename) {
    var filepath = folder + '/' + filename

    return this.delay().then(() => this.emit('files:trash', filepath))
  }

  bufferFile (folder, filename, callback) {
    return new Promise((resolve, reject) => {
      var filepath = folder + '/' + filename

      this.socket.emit('files:info', filepath, (err, info) => {
        ss(this.socket).emit('files:buffer', filepath, (err, stream) => {
          if (err) return reject(err)

          resolve({stream, info})
        })
      })
    })
  }
}

export default new FileServerService()
