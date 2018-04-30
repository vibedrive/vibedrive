import Vue from 'vue'
import Router from 'vue-router'
import queryString from 'query-string'

import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
  var credentials = queryString.parse(to.hash)

  if (credentials.access_token) {
    store.dispatch('auth:save-dropbox-token', credentials.access_token)
  }

  next()
})

export default router
