var fs = require('fs')
var path = require('path')
var util = require('util')
var ss = require('socket.io-stream')
var ffprobe = require('ffprobe')
var ffprobeStatic = require('ffprobe-static')
var trash = require('trash')
var musicmetadata = require('music-metadata')
var cp = require('cp')
var uuid = require('uuid/v4')
var { fixPathForAsarUnpack } = require('electron-util')

const { HOME, DIRECTORY, FORMATS } = require('@/constants')
const FFPROBE_PATH = fixPathForAsarUnpack(ffprobeStatic.path)

console.log('hello?', FFPROBE_PATH)

module.exports = {
  finishImporting: finishImporting,
  import: trackFromFile,
  buffer: bufferFile,
  trash: trashFile,
  info: getFileInfo
}

function finishImporting (filename, cb) {
  // if file exists in library we can delete it from inbox

  var src = path.join(DIRECTORY['inbox'], filename)
  var dest = path.join(DIRECTORY['library'], filename)

  fs.stat(dest, err => {
    if (err) return cb(err)
    fs.unlink(src, cb)
  })
}

function trackFromFile (filename, cb) {
  if (!FORMATS.AUDIO.includes(path.extname(filename))) {
    return cb(new Error('Wrong filetype.'))
  }

  var src = path.join(DIRECTORY['inbox'], filename)
  var dest = path.join(DIRECTORY['library'], filename)

  cp(src, dest, err => {
    if (err) return cb(err)

    fs.stat(dest, (err, stats) => {
      if (err) return cb(err)

      musicmetadata.parseFile(dest)
        .then(metadata => {
          metadata = formatMetadata(filename, stats, metadata)
          console.log(util.inspect(metadata))
          cb(null, metadata)
        })
        .catch(err => {
          console.log(err)
          cb(err)
        })
    })
  })
}

function formatMetadata (name, stats, metadata) {
  var { size } = stats
  var { artist, title, album, year, bpm, key, comment, picture } = metadata.common
  var { duration, bitrate, sampleRate } = metadata.format

  var attachments

  if (picture && picture.length) {
    attachments = {}

    picture.forEach((picture, i) => {
      attachments[i] = {
        content_type: 'image/' + picture.format,
        data: picture.data
      }
    })
  }

  return {
    _id: 'track::' + uuid(),
    _attachments: attachments,
    metadata: {
      artist,
      title,
      album,
      year,
      bpm,
      key,
      comments: comment,
      duration: duration * 1000
    },
    files: [
      {
        name,
        bitrate,
        sampleRate,
        size
      }
    ]
  }
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

  ffprobe(fullpath, { path: FFPROBE_PATH }, (err, info) => {
    if (err) return cb(err)

    info = info.streams.find(stream => stream.codec_type === 'audio')

    cb(null, info)
  })
}
