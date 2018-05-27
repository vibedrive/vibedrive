<template>
  <div id="playlists-menu" @contextmenu.prevent="openMenu($event)">
    <v-list  dense color="blue" style="background: none;"> 

      <v-list-tile to="/tracks/all" @contextmenu="openMenu($event)" > 
          <v-list-tile-avatar>
            <v-icon>
              queue_music
            </v-icon>
          </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>
            All tracks
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-group
         @contextmenu="openMenu($event)"
        v-for="group in groups"
        v-model="group.active" 
        :key="group.title">

        <v-list-tile slot="activator">
          <v-list-tile-avatar>
            <v-icon>
              folder
            </v-icon>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              {{ group.title }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile v-for="subItem in group.items" 
         @contextmenu="openMenu($event)"
          :key="subItem.title" 
          :to="'/tracks/' + subItem.id">

          <v-list-tile-avatar>
            <v-icon>
              queue_music
            </v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ subItem.title }}
            </v-list-tile-title>
          </v-list-tile-content>

          <v-spacer></v-spacer>

        </v-list-tile>
      </v-list-group>


      <v-list-tile 
        v-for="playlist in playlists"
        :data-playlist-id="playlist.id"
        @contextmenu.prevent.stop="openMenu($event, playlist)" 
        :key="playlist.title" 
        :to="'/tracks/' + playlist._id.split('::').slice(-1)[0]">

        <v-list-tile-avatar>
          <v-icon>
            queue_music
          </v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ playlist.name }}
          </v-list-tile-title>
        </v-list-tile-content>

        <v-spacer></v-spacer>
      </v-list-tile>


    </v-list>
      
    </v-spacer>

    <v-menu
      v-model="playlistMenu.open"  
      :position-x="playlistMenu.x"
      :position-y="playlistMenu.y" 
      offset-y absolute 
      close-delay="0"> 

      <v-list light dense color="white">
        <v-list-tile @click="createPlaylist()">
          <v-list-tile-title>New Playlist</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="playlistMenu.playlist" @click="deletePlaylist()">
          <v-list-tile-title>Delete Playlist</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<style lang="stylus">
  #playlists-menu
    min-height: 100%
    
    .list.list--dense
      padding-top: 0

    .list__tile.list__tile--link,
    .list__group__header
      border: 1px solid rgba(0,0,0,0)
      
    .theme--dark .list .list__tile--link:hover,
    .theme--dark .list .list__group__header:hover
      border: 1px solid #21A8BF
      background-color: transparent !important
      
    .list__tile.list__tile--link.list__tile--active
      background-color: #21A8BF
      .list__tile__title
        color: white
</style>

<script>
  export default {
    name: 'PlaylistsMenu',
    props: {
      
    },
    computed: {
      playlists: function () {
        return this.$store.state.playlists.playlists
      }
    },
    mounted () {
      db.playlists.get().then(playlists => {
        this.$store.dispatch('playlists/list', playlists)
      })
    },
    methods: {
      openMenu (e, playlist) {
        this.playlistMenu.playlist = null
        
        this.playlistMenu.open = false
        this.playlistMenu.x = e.clientX
        this.playlistMenu.y = e.clientY

        if (playlist) {
          this.playlistMenu.playlist = playlist
        }

        this.$nextTick(() => {
          this.playlistMenu.open = true
        })
      },
      createPlaylist () {
        db.playlists.create()
          .then(playlist => {
            this.$store.dispatch('playlists/create', playlist)
          })
      },
      deletePlaylist () {
        db.playlists.delete(this.playlistMenu.playlist._id)
          .then(playlistId => {
            this.$store.dispatch('playlists/delete', playlistId)

            if ('playlist::' + this.$route.params.trackId === playlistId) {
              this.$router.replace({ path: '/tracks/all' })
            }
          })
      }
    },
    data: () => ({
      playlistMenu: {
        x: 0,
        y: 0,
        open: false,
        playlist: null
      },
      groups: [{
        active: true,
        title: 'Podcast Playlists',
        items: [
          { id: 1, title: 'Untrapped', tags: ['Trap', 'Hip Hop'] }, 
          { id: 2, title: 'Impossible Illusions', tags: ['Techno', 'Dub', 'Electro'] }, 
          { id: 3, title: 'Headphone Grooves', tags: ['Disco', 'House', 'Funk'] }, 
          { id: 4, title: 'Tiny Dreamworlds', tags: ['Future', 'Chill', 'Experimental'] }, 
          { id: 5, title: 'All Systems Online', tags: ['8-bit', 'Electro', 'House'] }, 
          { id: 6, title: 'This Raw Self', tags: ['Whatever I feel like'] }
        ]
      }]
    })
  }
</script>

