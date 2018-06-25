var path = require('path')
var os = require('os')

const PORT = 9753
const HOME = path.join(os.homedir(), '/Dropbox/Apps/Vibedrive')

const DIRECTORY = {
  inbox: path.join(HOME, 'Inbox'),
  library: path.join(HOME, 'Library'),
  archives: path.join(HOME, 'Archives'),
  unsupported: path.join(HOME, 'Unsupported')
}

const FORMATS = {
  ARCHIVE: ['.rar', '.zip', '.tar', '.gz', '7z'],
  AUDIO: ['.mp3', '.wav', '.opus', '.ogg', '.flac', '.m4a']
}

module.exports = {
  PORT,
  HOME,
  DIRECTORY,
  FORMATS
}
