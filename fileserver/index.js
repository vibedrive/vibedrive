var fs = require('fs')
var os = require('os')
var path = require('path')
var http = require('http').Server()
var io = require('socket.io')(http)
var parallel = require('run-parallel')

io.on('connection', function (socket) {
  console.log('a user connected')

  listFiles((err, files) => {
    console.log(err, files)
    socket.emit('folders:inbox:list', files)
  })

  socket.on('folders:inbox:list', function () {

  })

  socket.on('disconnect', function () {})
})

http.listen(9753, function () {
  console.log('listening on *:9753')
})

function listFiles (cb) {
  var dir = path.join(os.homedir(), '/Dropbox/Apps/Vibedrive/Inbox')
  var statFiles = []

  fs.readdir(dir, (err, files) => {
    if (err) return cb(err)

    parallel(files.map(statTask), () => {
      cb(null, statFiles)
    })
  })

  function statTask (file) {
    return function (done) {
      fs.stat(path.join(dir, file), (err, stats) => {
        statFiles.push({
          name: file,
          filesize: stats.size,
          ino: stats.ino
        })

        done()
      })
    }
  }
}
