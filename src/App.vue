<template>
  <v-app id="app" dark>
    <v-toolbar app fixed dense clipped-left>
      <v-toolbar-title>
        <span>Vibedrive</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn flat to="/files">Files</v-btn>
        <v-btn flat to="/tracks">Tracks</v-btn>
        <v-btn flat to="/stream">Stream</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-menu bottom lazy offset-y min-width="240">
        <v-btn icon slot="activator" dark>
          <v-icon>account_circle</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-on:click="openPreferences">
            <v-list-tile-title >
              Preferences
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/login">
            <v-list-tile-title>
              Log In
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="/upgrade">
            <v-list-tile-title>
              Upgrade to Plus 
              <v-icon small color="white">star</v-icon>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <Notifications :error="state.notifications.error"></Notifications>
    <Preferences 
      :state="state" 
      :visible="preferences" 
      v-on:close="closePreferences">
    </Preferences>

    <router-view :state="state"/>
  </v-app>
</template>

<script>
  import storage from 'local-storage'
  import fileserver from '@/services/fileserver'

  import Notifications from '@/components/Notifications'
  import Preferences from '@/components/Preferences'
  import store from '@/store'

  export default {
    components: {
      Notifications,
      Preferences
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
</style>
