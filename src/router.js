import Vue from 'vue'
import Router from 'vue-router'
import queryString from 'query-string'
import storage from 'local-storage'

import Tracks from '@/Tracks/pages/Tracks.vue'
import Files from '@/Files/pages/Files.vue'

Vue.use(Router)

var homeRouteURLObject = {
  name: 'home',
  hash: ''
}

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
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
        var token = queryString.parse(to.hash).access_token

        if (token) {
          storage.set('vibedrive:dropbox-token', token)
          this.$store.dispatch('auth:save-dropbox-token', token)
        }

        return homeRouteURLObject
      }
    }
  ]
})

export default router
