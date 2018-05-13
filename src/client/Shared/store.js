import dropbox from '@/Services/dropbox'

export default {
  state: {
    notifications: {
      error: {
        timeout: 3000,
        visible: false,
        text: ''
      }
    }
  },
  mutations: {

  },
  actions: {
    'auth:save-dropbox-token': function (context, token) {
      dropbox.token = token
    }
  }
}
