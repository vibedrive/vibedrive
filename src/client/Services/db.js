import PouchDB from 'pouchdb'
import authentication from 'pouchdb-authentication'

PouchDB.plugin(authentication)

const DB_KEY = 'vibedrive1'
const REMOTE_URL = 'http://localhost:5984'

class DB {
  constructor () {
    this.local = new PouchDB(DB_KEY)

    this.tracks = {
      list: this.listTracks.bind(this),
      create: this.createTrack.bind(this)
    }

    this.playlists = {
      get: this.getPlaylist.bind(this)
    }
  }

  login (username, password) {
    var url = `${REMOTE_URL}/userdb-${toHex(username)}`

    this.remote = new PouchDB(url, { skip_setup: true })

    return this.remote.logIn(username, password)
      .then(user => {
        this.startSyncing()
        return user
      })
  }

  startSyncing () {
    var opts = { live: true }

    this.sync = PouchDB.sync(this.local, this.remote, opts)
  }

  getPlaylist (id) {
    if (id === 'all') return this.tracks.list()

    return this.local.get(id)
      .then(doc => {
        var opts = {
          include_docs: true,
          attachments: true,
          keys: doc.tracks
        }

        return this.local.allDocs(opts)
      })
  }

  listTracks () {
    var opts = {
      include_docs: true,
      attachments: true,
      startkey: 'track::',
      endkey: 'track::\ufff0'
    }

    return this.local.allDocs(opts).then(mapToDocs)
  }

  createTrack (track) {
    for (var key in track._attachments) {
      track._attachments[key].data = new Blob([track._attachments[key.data]])
    }

    return this.local.put(track)
  }
}

function mapToDocs (res) {
  return res.rows.map(row => row.doc)
}

function toHex (s) {
  var s = unescape(encodeURIComponent(s))
  var h = ''

  for (var i = 0; i < s.length; i++) {
    h += s.charCodeAt(i).toString(16)
  }

  return h
}

var db = new DB()

global.db = db

export default db
