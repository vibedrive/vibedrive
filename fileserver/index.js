var fs = require('fs')
var path = require('path')
var http = require('http')
var socketIO = require('socket.io')
var parallel = require('run-parallel')

const { PORT, VIBEDRIVE_HOME, DIRECTORY } = require('./constants')

var server = http.Server()
var io = socketIO(http)

io.on('connection', function (socket) {
  socket.on('folders:inbox:list', cb => listFiles(DIRECTORY.INBOX, cb))
  socket.on('folders:archives:list', cb => listFiles(DIRECTORY.ARCHIVES, cb))
})

server.listen(PORT, function () {
  console.log('Vibedrive File Server listening on', PORT)
})

function listFiles (key, cb) {
  var dir = dirPath(key)
  var statFiles = []

  fs.readdir(dir, (err, files) => {
    if (err) return cb(err)

    parallel(files.map(statTask), () => {
      cb(null, statFiles)
    })
  })

  function statTask (file) {
    return done => {
      fs.stat(path.join(dir, file), (err, stats) => {
        if (err) return done(err)

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

function dirPath (directory) {
  return path.join(VIBEDRIVE_HOME, directory)
}
