import Vue from 'vue'
import Vuex from 'vuex'

import dropbox from '@/Shared/services/dropbox'
import audioStore from '@/Audio/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    audio: audioStore
  },
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
})
