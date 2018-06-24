var fs = require('fs')
var path = require('path')
var { promisify } = require('util')
var cp = promisify(require('cp'))
var mv = promisify(require('mv'))
var parallel = require('run-parallel')
var readdir = promisify(fs.readdir)

const { DIRECTORY } = require('@/constants')

module.exports = {
  list: listFiles,
  clean: cleanInbox
}

function listFiles (key, cb) {
  var dir = DIRECTORY[key]
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

function cleanInbox (cb) {
  var inbox = DIRECTORY['inbox']
  var promises = []

  readdir(inbox).then(files => {
    files.forEach(file => {
      var ext = path.extname(file).toLowerCase()

      if (archiveFormats.includes(ext)) {
        return promises.push(mv(path.join(inbox, file), path.join(archives, file)))
      }

      if (!validAudioTypes.includes(ext)) {
        return promises.push(mv(path.join(inbox, file), path.join(unsupported, file)))
      }
    })

    Promise.all(promises).then(() => {
      cb(null)
    })
  })
}
