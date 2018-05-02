import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    plugins: {
      dropbox: {
        token: ''
      }
    }
  },
  mutations: {
    saveDropboxToken (state, token) {
      state.plugins.dropbox.token = token
    }
  },
  actions: {
    'auth:save-dropbox-token': function (context, token) {
      context.commit('saveDropboxToken', token)
    }
  }
})
