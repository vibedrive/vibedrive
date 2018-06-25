var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var watchify = require('watchify')
var mkdirp = require('mkdirp')

mkdirp.sync(path.join(__dirname, '../www'))

copy()

var b = browserify('src/index.js')

b.plugin(watchify, {
  ignoreWatch: ['**/node_modules/**']
})

b.on('update', bundle)

bundle()

function bundle () {
  b.bundle().pipe(fs.createWriteStream(path.join(__dirname, '../www/bundle.js')))
}

function copy () {
  fs.createReadStream(path.join(__dirname, '../src/index.html'))
    .pipe(fs.createWriteStream(path.join(__dirname, '../www/index.html')))
}
