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

Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


