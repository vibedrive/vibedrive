var path = require('path')
var os = require('os')

const PORT = 9753
const VIBEDRIVE_HOME = path.join(os.homedir(), '/Dropbox/Apps/Vibedrive')
const DIRECTORY = {
  INBOX: 'Inbox',
  ARCHIVES: 'Archives',
  UNSUPPORTED: 'Unsupported'
}

module.exports = {
  PORT,
  VIBEDRIVE_HOME,
  DIRECTORY
}
