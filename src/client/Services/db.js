import Vue from 'vue'
import PouchDB from 'pouchdb'
import authentication from 'pouchdb-authentication'
import uuid from 'uuid/v4'

PouchDB.plugin(authentication)

const DB_KEY = 'vibedrive'
const REMOTE_URL = 'http://localhost:5984'

class DB {
  constructor () {
    this.local = new PouchDB(DB_KEY)

    this.session = {
      get: this.getSession.bind(this)
    }

    this.tracks = {
      list: this.listTracks.bind(this),
      create: this.createTrack.bind(this)
    }

    this.playlists = {
      get: this.getPlaylists.bind(this),
      create: this.createPlaylist.bind(this),
      delete: this.deletePlaylist.bind(this)
    }
  }

  getSession (user = localStorage.getItem('vibedrive:user')) {
    if (user) {
      var url = `${REMOTE_URL}/userdb-${user}`

      this.remote = new PouchDB(url, { skip_setup: true })

      this.remote.getSession().then(session => {
        this.startSyncing()

        return session
      })
    }
  }

  login (username, password) {
    var url = `${REMOTE_URL}/userdb-${toHex(username)}`

    this.remote = new PouchDB(url, { skip_setup: true })

    return this.remote.logIn(username, password).then(user => {
      this.startSyncing()

      localStorage.setItem('vibedrive:user', toHex(username))

      return user
    })
  }

  startSyncing () {
    var opts = { live: true }

    this.sync = PouchDB.sync(this.local, this.remote, opts)
  }

  getPlaylists (id) {
    if (id === 'playlist::all') {
      return this.tracks.list().then(tracks => ({
        _id: id,
        name: 'All tracks',
        tracks
      }))
    }

    if (!id) {
      var opts = {
        include_docs: true,
        attachments: true,
        startkey: 'playlist::',
        endkey: 'playlist::\ufff0'
      }

      return this.local.allDocs(opts).then(mapToDocs)
    }

    return this.local.get(id)
  }

  createPlaylist () {
    var playlist = {
      _id: 'playlist::' + uuid(),
      name: ''
    }

    return this.local.put(playlist).then(() => playlist)
  }

  deletePlaylist (id) {
    return this.playlists.get(id)
      .then(playlist => this.local.remove(playlist))
      .then(res => res.id)
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
