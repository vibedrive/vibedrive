import PouchDB from 'pouchdb'

class DB {
  constructor () {
    this.local = new PouchDB('vibedrive1')

    this.tracks = {
      list: this.listTracks.bind(this),
      create: this.createTrack.bind(this)
    }

    this.playlists = {
      get: this.getPlaylist.bind(this)
    }
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

var db = new DB()

global.db = db

export default db
