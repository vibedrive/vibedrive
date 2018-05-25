<template>
  <div class="table-overflow">
    <table class="datatable table pt-5 mt-5" slot="activator">
      <tbody>
        <tr class="black  "  >
          <th class="file-row px-0"></th>
          <th class="text-xs-left">File Name</th>
          <th class="text-xs-right">Size</th>
        </tr>
        <tr v-for="item in items" 
          v-bind:class="{ blackish: fileIsPlaying(item) }"
          @contextmenu="openMenu($event, item)">
          <td class="file-row px-0" style="width: 48px;">
            <v-btn icon
              class="play-btn"
              @click="preview(item)" 
              :ripple="false" 
              :loading="fileIsBuffering(item)"
              :class="{ 'playing': $store.state.audio.status === 'playing' && fileIsPlaying(item) }">
              <v-icon>
                {{ fileIsPlaying(item) 
                    ? $store.state.audio.status === 'paused'
                      ? 'play_circle_filled' 
                      : 'pause_circle_filled'
                    : 'play_circle_filled' 
                }}
              </v-icon>
            </v-btn>
          </td>

          <td class="text-xs-left">
            {{ item.name }}
          </td>

          <td class="text-xs-right">
            {{ item.filesize | toMB }} MB
          </td>
        </tr>
      </tbody>
    </table>

    <v-menu
      v-model="menu.open"  
      :position-x="menu.x"
      :position-y="menu.y" 
      offset-y absolute 
      close-delay="0"> 

      <v-list light color="white">
        <v-list-tile @click="importFile(menu.file)">
          <v-list-tile-title>Import As Track</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="promptBeforeTrash(menu.file)">
          <v-list-tile-title>Move to Trash</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import fileserver from '@/Services/fileserver'
import db from '@/Services/db'

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
    menu: {
      x: 0,
      y: 0,
      open: false,
      file: null
    },
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
    openMenu ($event, file) {
      $event.preventDefault()
      this.menu.file = file
      this.menu.open = false
      this.menu.x = $event.clientX
      this.menu.y = $event.clientY
      this.$nextTick(() => {
        this.menu.open = true
      })
    },
    importFile (file) {
      fileserver.inbox.import(file.name)
        .then(track => db.tracks.create(track))
        .then(() => fileserver.inbox.finishImport(file.name))
        .then(() => this.$emit('remove', file))
        .catch(console.error)
    },
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
  tr
    background-color: #2B3039
    
  .theme--dark .table tbody tr:hover:not(.datatable__expand-row), 
  .application .theme--dark.table tbody tr:hover:not(.datatable__expand-row)
    background-color: #242A35 !important
    
  .blackish
    background-color: #212329
    
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
      
  // .play-btn
  //   opacity: 0
        
  tr:hover 
    .play-btn
      opacity: 1
</style>
