import io from 'socket.io-client'

class FileServerService {
  constructor () {
    var socket = io('http://localhost:9753')

    socket.on('connect', function () {

    })

    socket.on('folders:inbox:list', function (data) {
      console.log(data)
    })

    socket.on('disconnect', function () {})
  }
}

export default new FileServerService()
