import { Dropbox } from 'dropbox'
import constants from '@/constants'

class DropboxService {
  constructor () {
    this.$dbx = new Dropbox({ clientId: constants.DROPBOX_CLIENT_ID })

    this.authenticationURL = this.$dbx.getAuthenticationUrl(constants.URL + '/dbx')

    this.folders = {
      list: () => this.$dbx.filesListFolder({ path: '/Inbox' })
    }
  }

  set token (accessToken) {
    this.$dbx.setAccessToken(accessToken)
  }

  isConnected () {
    return !!this.$dbx.getAccessToken()
  }
}

export default new DropboxService()
