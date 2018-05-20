<template>
  <v-data-table
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
        <v-btn icon
          class="play-btn"
          @click="preview(props.item)" 
          :ripple="false" 
          
          :class="{ 'playing': $store.state.audio.status === 'playing' && trackIsPlaying(props.item) }">
          <v-icon>
          </v-icon>
        </v-btn>
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
</template>

<script>
import db from '@/Services/db'
import PlaylistsMenu from '@/Tracks/components/PlaylistsMenu'

export default {
  name: 'Tracks',
  props: {
    items: Array,
    loading: Boolean
  },
  mounted: function () {
    db.tracks.list().then(tracks => {
      this.tracks = tracks
    })
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
      
  .play-btn
    opacity: 0
        
  tr:hover 
    .play-btn
      opacity: 1
</style>
