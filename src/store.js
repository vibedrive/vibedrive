import Vue from 'vue'
import Vuex from 'vuex'

import dropbox from '@/Shared/services/dropbox'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    audio: {
      loading: false,
      playing: {},
      buffering: {}
    },
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
})
