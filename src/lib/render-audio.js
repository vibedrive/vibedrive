import path from 'path'
import toBlobURL from 'stream-to-blob-url'
import MediaStream from '@/lib/MediaStream'

var mimeTypes = {
  '.aac': 'audio/aac',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
}

export default function renderAudio (filename, stream, target) {
  return new Promise((resolve, reject) => {
    var ext = path.extname(filename).toLowerCase()

    // MediaSource can't parse .m4a, so buffer the whole track
    if (ext === '.m4a') {
      return toBlobURL(stream, (err, url) => {
        if (err) return reject(err)

        target.src = url
        target.play()

        resolve()
      })
    }

    var type = mimeTypes[ext]
    var writeStream = new MediaStream(target, { type })

    stream.pipe(writeStream)

    resolve()
  })
}
