<template>
  <v-data-table
    :disable-initial-sort="true"
    :items="items"
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
          :loading="fileIsBuffering(props.item)"
          :class="{ 'playing': $store.state.audio.status === 'playing' && fileIsPlaying(props.item) }">
          <v-icon>
            {{ fileIsPlaying(props.item) 
                ? $store.state.audio.status === 'paused'
                  ? 'play_circle_filled' 
                  : 'pause_circle_filled'
                : 'play_circle_filled' 
            }}
          </v-icon>
        </v-btn>
      </td>

      <td class="text-xs-left">
        {{ props.item.name }}
      </td>

      <td class="text-xs-right">
        {{ props.item.filesize | toMB }} MB
      </td>

      <td class="justify-center layout px-0">
        <v-menu bottom left offset-y dark>
          <v-btn icon class="mx-0" slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>

            <v-list-tile @click="">
              <v-list-tile-title>Import As Track</v-list-tile-title>
            </v-list-tile>

            <v-list-tile @click="promptBeforeTrash(props.item)">
              <v-list-tile-title>Move to Trash</v-list-tile-title>
            </v-list-tile>

          </v-list>
        </v-menu>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'InboxTable',
  props: {
    items: Array,
    loading: Boolean
  },
  computed: {
    noDataText () {
      if (this.error) return this.error

      return 'No files found.'
    }
  },
  data: () => ({
    rowsPerPage: [24],
    headers: [{
      sortable: false,
      width: 20,
      value: 'name'
    }, {
      text: 'File Name',
      value: 'name'
    }, {
      text: 'Size',
      width: 128,
      align: 'right',
      value: 'filesize'
    }, {
      sortable: false,
      width: 32,
      value: 'name'
    }]
  }),
  methods: {
    fileIsPlaying (file) {
      return this.$store.state.audio.file && this.$store.state.audio.file.ino === file.ino
    },
    fileIsBuffering (file) {
      return this.$store.state.audio.buffering && this.fileIsPlaying(file)
    },
    preview (file) {
      this.$store.dispatch('audio/preview', file)

      var index = this.items.findIndex(f => f.ino === file.ino)
      var queue = this.items.slice(index + 1)

      this.$store.dispatch('audio/queue:set', queue)
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
