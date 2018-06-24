var uuid = require('uuid')

module.exports = {
  create: createTrack,
  list: listTracks
}

function createTrack (track, cb) {
  track.id = uuid.v4()

  this.db.put(`track:${track.id}`, track, cb)
}

function listTracks (cb) {
  var results = []
  var opts = getKeyOpts('track')
  var read = this.db.createReadStream(opts)

  read.on('data', onData)
  read.on('end', onEnd)
  read.on('error', onError)

  function onData (data) {
    results.push(data)
  }

  function onEnd () {
    cb(null, results)
  }

  function onError (err) {
    cb(err)
  }
}

function getKeyOpts (key) {
  return {
    gte: key,
    lte: String.fromCharCode(key.charCodeAt(0) + 1)
  }
}
