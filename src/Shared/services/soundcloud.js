/* globals SC */

import constants from '@/constants'

var { URL, SOUNDCLOUD_CLIENT_ID } = constants

class SoundcloudService {
  constructor () {
    SC.initialize({
      client_id: SOUNDCLOUD_CLIENT_ID,
      redirect_uri: URL + '/callback.html'
    })
  }

  connect () {
    return SC.connect()
      .then(() => SC.get('/me'))
      .then(user => user)
  }
}

export default new SoundcloudService()
