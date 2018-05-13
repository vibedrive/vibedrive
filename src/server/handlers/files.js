var fs = require('fs')
var path = require('path')
var ss = require('socket.io-stream')
var ffprobe = require('ffprobe')
var ffprobeStatic = require('ffprobe-static')
var trash = require('trash')

const { HOME } = require('@/constants')

module.exports = {
  buffer: bufferFile,
  trash: trashFile,
  info: getFileInfo
}

function bufferFile (filepath, cb) {
  var fullpath = path.join(HOME, filepath)
  var source = fs.createReadStream(fullpath)
  var sink = ss.createStream()

  cb(null, sink)

  source.pipe(sink)
}

function trashFile (filepath, cb) {
  var fullpath = path.join(HOME, filepath)

  return trash([ fullpath ]).then(() => {
    cb(null, trashFile, { status: 200 })
  })
}

function getFileInfo (filepath, cb) {
  var fullpath = path.join(HOME, filepath)

  ffprobe(fullpath, { path: ffprobeStatic.path }, (err, info) => {
    if (err) return cb(err)

    info = info.streams.find(stream => stream.codec_type === 'audio')

    cb(null, info)
  })
}
