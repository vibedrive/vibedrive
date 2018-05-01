<template>

  <v-app id="app" dark>

    <v-navigation-drawer fixed permanent v-model="drawer" app>
      <PlaylistsMenu></PlaylistsMenu>    
    </v-navigation-drawer>

    <v-toolbar app fixed>
      <v-toolbar-title></v-toolbar-title>
    </v-toolbar>
    <v-content>

      <router-view/>

    </v-content>
    <v-footer app fixed>
      
    </v-footer>
  </v-app>
</template>

<style lang="stylus">
  #app
    font-family: 'Work Sans', sans-serif
    font-weight: 500
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale

  #nav
    padding 30px
    a
      font-weight bold
      color #2c3e50
      &.router-link-exact-active
        color #42b983
</style>

<script>
  import PlaylistsMenu from '@/components/PlaylistsMenu'

  export default {
    data: () => ({
      drawer: true
    }),
    props: {
      source: String
    },
    components: {
      PlaylistsMenu
    }
  }
</script>
