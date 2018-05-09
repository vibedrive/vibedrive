<template>
  <div id="app" class="grey darken-4">
    <v-app dark class="w">

      <Navbar :state="state"></Navbar>

        <main class="scroll-y my-5">
          <router-view :state="state"></router-view>
        </main>
      
      <AudioToolbar :state="state"></AudioToolbar>
        
    </v-app>

    <Notifications :error="state.notifications.error"></Notifications>
  </div>
</template>

<script>
import storage from 'local-storage'

import Navbar from '@/Layout/components/Navbar'
import Notifications from '@/Layout/components/Notifications'
import AudioToolbar from '@/Layout/components/AudioToolbar'

import store from '@/store'

export default {
  components: {
    Navbar,
    Notifications,
    AudioToolbar
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
  data: () => ({
    drawer: true,
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
  .w
    max-width: 60em
    margin: 0 auto
  
  #app
    font-family: 'Work Sans', sans-serif
    font-weight: 500
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    
  main
    // max-height: calc(100vh - 8rem)
      
  .invisible
    opacity: 0

</style>
