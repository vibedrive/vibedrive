var Mod = require('module')
var req = Mod.prototype.require

module.exports = absolute

function absolute (dir) {
  Mod.prototype.require = function (filepath) {
    if (filepath.slice(0, 2) === '@/') {
      filepath = filepath.replace('@', dir)
    }

    return req.apply(this, arguments)
  }
}
