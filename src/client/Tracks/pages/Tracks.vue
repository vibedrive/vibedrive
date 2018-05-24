<template>
  <v-layout>
  <v-flex style="min-width: 270px; max-width: 270px">
    <!-- <v-container> -->
      <PlaylistsMenu></PlaylistsMenu>
    <!-- </v-container> -->
  </v-flex>
  <v-flex >
  <v-data-table
    id="tracks-table"
    :disable-initial-sort="true"
    :items="tracks"
    :headers="headers"
    :loading="loading"
    :no-data-text="noDataText"
    :ripple="false"
    item-key="name"
    :rows-per-page-items="rowsPerPage">

    <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

    <template slot="items" slot-scope="props">

      <td class="file-row px-0">
        <div class="cover-img text-xs-center pa-1 mx-2">
          <div></div>
        </div>
      </td>

      <td class="text-xs-left">
        {{ props.item.metadata.title }}
      </td>

      <td class="text-xs-left">
        {{ props.item.metadata.artist }}
        
      </td>

      <td class="text-xs-left">
        
        
      </td>

      <td class="justify-center layout px-0">
        <v-menu bottom lazy close-delay="0"> 
          <v-btn icon class="mx-0" slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>

          <v-list light color="white">
            <v-list-tile @click="">
              <v-list-tile-title></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </td>
    </template>
  </v-data-table>
  
  </v-flex>
  </v-layout>
</template>

<script>
import db from '@/Services/db'
import PlaylistsMenu from '@/Tracks/components/PlaylistsMenu'

export default {
  name: 'Tracks',
  props: {
    items: Array,
    loading: Boolean,
    trackId: String
  },
  components: {
    PlaylistsMenu
  },
  watch: {
    trackId: function () {
      this.loadTracks()
    }
  },
  mounted: function () {
    this.loadTracks()
  },
  computed: {
    noDataText () {
      if (this.error) return this.error

      return 'No files found.'
    }
  },
  data: () => ({
    tracks: [],

    rowsPerPage: [24],
    headers: [{
      sortable: false,
      width: 20,
      value: 'name'
    }, {
      text: 'Title',
      value: 'title',
      width: 320
    }, {
      text: 'Artist',
      width: 256,
      value: 'artist'
    }, {
      text: '',
      value: 'name'
    }, {
      sortable: false,
      width: 32,
      value: 'name'
    }]
  }),
  methods: {
    loadTracks () {
      db.playlists.get(this.trackId)
        .then(tracks => {
          this.tracks = tracks
        })
        .catch(err => {
          console.error(err)
          this.tracks = []
        })
    },
    trackIsPlaying (track) {
      return (
        this.$store.state.audio.file && 
        this.$store.state.audio.file.name === track.files[0].name
      )
    },
    trackIsBuffering (track) {
      return this.$store.state.audio.buffering && this.trackIsPlaying(track)
    },
    preview (track) {
      console.log(track.files[0])
      this.$store.dispatch('audio/preview', track.files[0])
    }
  }
}
</script>

<style lang="stylus" scope>

  .cover-img
    width: 32px
    height: 32px
    display: flex
    
    div
      width: 100%
      height: 100%
      background-color: turquoise

  #upload-btn:hover
    cursor: pointer

  input[type="file"]
    display: none

  .playing
    animation: 1s flashing infinite linear
    
  @keyframes flashing
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
        
  .theme--dark .datatable thead th.column.sortable
    padding-top: 12px
    vertical-align: top
    height: 24px

  #tracks-table table.table thead tr
    height: 40px

  tr:hover 
    .play-btn
      opacity: 1
</style>
