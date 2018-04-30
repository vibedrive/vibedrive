import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    
  },
  mutations: {
    
  },
  actions: {
    'auth:save-dropbox-token': function () {
      console.log(arguments)
    }
  }
})
