var mobileFS = {
  fs: null,
  createFS: function createFS (done) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, _fs_ => {
      var fs = FS(_fs_)
      module.exports = fs
      done(fs)
    }, console.error)
  }
}

module.exports = mobileFS

function FS (_fs_) {
  if (!(this instanceof FS)) return new FS(_fs_)
  this._fs = _fs_
}

FS.prototype.readFile = function (src, callback) {
  var opts = { create: false, exclusive: false }

  this._fs.root.getFile(src, opts, function (fileEntry) {
    fileEntry.file(function (file) {
      var reader = new window.FileReader()

      reader.onloadend = function () {
        callback(null, this.result)
      }

      reader.readAsText(file)
    }, callback)
  }, callback)
}

FS.prototype.writeFile = function (src, data, callback) {
  var opts = { create: true, exclusive: false }

  this._fs.root.getFile(src, opts, function (fileEntry) {
    fileEntry.createWriter(function (fileWriter) {
      fileWriter.onwriteend = function () {
        callback()
      }

      fileWriter.onerror = function (err) {
        callback(err)
      }

      var blob = new window.Blob([data], { type: 'text/plain' })

      fileWriter.write(blob)
    })
  }, callback)
}
