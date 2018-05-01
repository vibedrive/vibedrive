import('isomorphic-fetch')

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/fonts/WorkSans.css'

import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

var { Dropbox } = require('dropbox')
var { CLIENT_ID } = require('@/../env')

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.prototype.dbx = new Dropbox({ clientId: CLIENT_ID })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
