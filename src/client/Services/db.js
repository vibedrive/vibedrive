import PouchDB from 'pouchdb'

class DB {
  constructor () {
    this.local = new PouchDB('vibedrive1')

    this.tracks = {
      list: () => this.local.allDocs({
        include_docs: true,
        attachments: true,
        startkey: 'track::',
        endkey: 'track::\ufff0'
      }).then((response) => {
        return response.rows.map(row => row.doc)
      }),

      create: track => {
        for (var key in track._attachments) {
          track._attachments[key].data = new Blob([track._attachments[key.data]])
        }

        return this.local.put(track)
      }
    }
  }
}

var db = new DB()

global.db = db

export default db
