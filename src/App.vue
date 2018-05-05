<template>
  <div id="app">
    <v-app dark>
      <Navbar></Navbar>
      <main class="scroll-y my-5">
        <router-view :state="state"></router-view>
      </main>
      <AudioPlayer></AudioPlayer>
    </v-app>

    <Notifications :error="state.notifications.error"></Notifications>
  </div>
</template>

<script>
import storage from 'local-storage'

import Navbar from '@/Layout/components/Navbar'
import Notifications from '@/Layout/components/Notifications'
import AudioPlayer from '@/Layout/components/AudioPlayer'

import store from '@/store'

export default {
  components: {
    Navbar,
    Notifications,
    AudioPlayer
  },
  mounted () {
    this.storage = storage
    this.store = store

    var token = this.storage.get('vibedrive:dropbox-token')
    if (token) this.store.dispatch('auth:save-dropbox-token', token)
  },
  computed: {
    state: function () {
      return store.state
    }
  },
  methods: {
    openPreferences: function () {
      this.preferences = true
    },
    closePreferences: function () {
      this.preferences = false
    }
  },
  data: () => ({
    drawer: true,
    preferences: false,
    error: {
      visible: false,
      text: '',
      timeout: 3000
    },
    items: [
      { title: 'Profile', href: '/profile' }
    ]
  })
}
</script>

<style lang="stylus">
  #app
    font-family: 'Work Sans', sans-serif
    font-weight: 500
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    
  main
    // max-height: calc(100vh - 8rem)

</style>
