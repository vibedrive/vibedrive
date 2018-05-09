import 'isomorphic-fetch'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/fonts/WorkSans.css'
import '@/Shared/filters'
import '@/registerServiceWorker'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'

import Layout from '@/Layout/Layout.vue'
import router from '@/router'
import audioStore from '@/Audio/store'
import sharedStore from '@/Shared/store'

Vue.use(Vuetify)
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  router,
  store: new Vuex.Store({
    modules: {
      audio: audioStore,
      shared: sharedStore
    }
  }),
  render: h => h(Layout)
}).$mount('#app')
