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
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-menu bottom lazy offset-y min-width="240">
        <v-btn icon slot="activator" dark>
          <v-icon>account_circle</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in items" :key="i" @click="router.push(item.href)">
            <v-list-tile-title>
              {{ item.title }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-snackbar
      :timeout="error.timeout"
      color="red"
      top right
      multi-line vertical
      v-model="error.visible"
      @click.native="error.visible = false">
      {{ error.text }}
    </v-snackbar>

    <router-view :state="state"/>
  </v-app>
</template>

<script>
  import storage from 'local-storage'

  import router from '@/router'
  import store from '@/store'

  export default {
    mounted () {
      this.router = router
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
  #app
    font-family: 'Work Sans', sans-serif
    font-weight: 500
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
</style>
