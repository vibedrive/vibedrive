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
        return []
      })
    }
  }
}

export default new DB()
