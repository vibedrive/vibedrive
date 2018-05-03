import Vue from 'vue'
import Router from 'vue-router'
import queryString from 'query-string'
import storage from 'local-storage'

import Tracks from './views/Tracks.vue'
import Files from './views/Files.vue'

import store from './store'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/files'
    },
    {
      path: '/files',
      name: 'files',
      component: Files
    },
    {
      path: '/tracks',
      name: 'tracks',
      component: Tracks
    },
    {
      path: '/dbx',
      name: 'dbx',
      redirect: to => {
        var { access_token } = queryString.parse(to.hash)

        if (access_token) {
          storage.set('vibedrive:dropbox-token', access_token)
          store.dispatch('auth:save-dropbox-token', access_token)
        }

        return { name: 'profile', hash: '' }
      }

    }
  ]
})

export default router
