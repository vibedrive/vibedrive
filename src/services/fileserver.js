var io = require('socket.io-client')
var promisify = require('util-promisify')

class FileServerService {
  constructor () {
    var socket = io('http://localhost:9753')

    this.emit = promisify(socket.emit).bind(socket)
    this.files = {
      list: this.listFiles.bind(this)
    }
  }

  listFiles () {
    return this.emit('folders:inbox:list')
  }
}

export default new FileServerService()
