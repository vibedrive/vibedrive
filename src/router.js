import Vue from 'vue'
import Router from 'vue-router'
import queryString from 'query-string'
import storage from 'local-storage'

import Tracks from './views/Tracks.vue'
import Files from './views/Files.vue'
import Profile from './views/Profile.vue'
import SoundcloudStream from './views/SoundcloudStream.vue'

import store from './store'

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
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/stream',
      name: 'stream',
      component: SoundcloudStream
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

        return homeRouteURLObject
      }
    },
    {
      path: '/callback.html',
      name: 'sc',
      redirect: to => {
        var { code, access_token, scope, state } = queryString.parse(to.hash)

        if (access_token) {
          storage.set('vibedrive:soundcloud-token', access_token)
          store.dispatch('auth:save-soundcloud-token', access_token)

          window.close()
        }

        return homeRouteURLObject
      }
    }
  ]
})

export default router
