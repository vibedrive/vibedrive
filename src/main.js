import 'isomorphic-fetch'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/fonts/WorkSans.css'

import App from './App.vue'
import router from './router'
import store from './store'

import '@/Shared/filters'
import './registerServiceWorker'

Vue.use(Vuetify)
Vue.use(Vuex)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
