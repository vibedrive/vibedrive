var path = require('path')
var os = require('os')
var fs = require('fs')

var defaultConfig = {
  PORT: 15796
}

module.exports = loadConfig

function loadConfig () {
  try {
    var file = fs.readFileSync(path.join(os.homedir(), '/.vibedbrc'), 'utf8')
    var config = JSON.parse(file)

    return config
  } catch (err) {
    return defaultConfig
  }
}
