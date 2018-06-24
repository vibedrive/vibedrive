var { createFS } = require('./lib/mobile-fs')
var choo = require('choo')
var devtools = require('choo-devtools')
var sheetify = require('sheetify')
var nanoquery = require('nanoquery')

choo.prototype._matchRoute = function (locationOverride) {
  var location, queryString
  if (locationOverride) {
    location = locationOverride.replace(/\?.+$/, '')
    queryString = locationOverride
  } else {
    location = this._createLocation()
    queryString = window.location.search
  }
  var matched = this.router.match(location)
  this.state.href = location
  this.state.query = nanoquery(queryString)
  this.state.previousRoute = this.state.route
  this.state.route = matched.route
  this.state.params = matched.params
  this.state._handler = matched.cb
  return this.state
}

var routes = require('./routes')

sheetify('tachyons')
sheetify('./style.css')

document.addEventListener('deviceready', () => createFS(), false)

var app = choo()

// app.use(devtools())
app.use(routes())

app.use(function (state, emitter) {
  state.storageSource = 0
  state.playlists = [
    { title: 'My playlist A', tracks: [{ title: '', artist: '' }] },
    { title: 'My playlist B' }
  ]

  emitter.on('DOMContentLoaded', function () {
    emitter.on('select-storage-source', function (storageSource) {
      state.storageSource = storageSource
      emitter.emit('render')
    })
  })
})

app.mount('body')
