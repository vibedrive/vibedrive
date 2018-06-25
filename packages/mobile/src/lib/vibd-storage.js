var isCordovaApp = !!window.cordova
var fs

if (isCordovaApp) {
  fs = require('./mobile-fs').fs
} else {
  fs = require('fs')
}

module.exports = Storage(fs)

function Storage (fs) {
  this.fs = fs
}
