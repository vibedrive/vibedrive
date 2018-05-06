<template>
  <v-card flat color="grey darken-3">
    <v-card-title>
        <v-select
          label="~/Dropbox/Apps/Vibedrive/Inbox"
          disabled
        ></v-select>
        
        <v-btn class="invisible">
          <span></span>
        </v-btn>

        <v-tooltip top color="black">
          <v-btn slot="activator" @click="fetchFiles"color="white" light :ripple="false">
            <v-icon>cached</v-icon>
            <span>Refresh</span>
          </v-btn>
          <span>Refresh</span>
        </v-tooltip>

        <v-menu offset-y light full-width>
          <v-btn slot="activator" color="white"  light :ripple="false">
            Actions
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list light dense>
            <v-list-tile @click="cleanInbox">
              <v-list-tile-title>Clean Folder</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

    </v-card-title>

    <v-data-table
      :items="files"
      :headers="headers"
      :loading="loading"
      :no-data-text="noDataText"
      :rows-per-page-items="rowsPerPage"
      v-model="selected"
      item-key="name"
      :ripple="false">

      <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

      <template slot="items" slot-scope="props">

        <td class="px-0">
          <v-btn icon
            :ripple="false" 
            @click="play(props.item)" 
            :loading="buffering === props.item.name"
            :class="{ 'playing': playing === props.item.name }">
            <v-icon>{{ playing === props.item.name ? 'pause_circle_filled' : 'play_circle_filled' }} </v-icon>
          </v-btn>
        </td>

        <td class="text-xs-left" >
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
    <input 
      type="file"
      id="upload"
      @change="onFileChange"
      accept multiple>

    <v-dialog v-model="modal" max-width="320" lazy>
      <v-card>
        <v-card-title class="headline">Move to trash?</v-card-title>
        <v-card-text>
          {{ fileToDelete.filename }} 
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" dark @click.native="closeTrashModal(fileToDelete)">Confirm</v-btn>
          <v-btn color="white" light @click.native="closeTrashModal()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <audio ref="audio"></audio>

  </v-card>
</template>

<script>
import fileserver from '@/Files/services/fileserver'

export default {
  name: 'InboxTable',
  props: {},
  computed: {
    noDataText () {
      if (this.error) return this.error

      return 'No files found.'
    }
  },
  data: () => ({
    search: '',
    error: '',
    buffering: '',
    playing: '',
    loading: true,
    modal: false,
    action: null,
    fileToDelete: {},
    dropdown_font: ['Clean'],
    selected: [],
    rowsPerPage: [9],
    files: [],
    headers: [{
      sortable: false,
      width: 32,
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
  mounted: function () {
    this.$nextTick(function () {
      this.fetchFiles()
    })
  },
  methods: {
    onSelectAction: function (action) {
      if (action) {
        console.log(action)
        this.$refs.form.reset()
      }
    },
    cleanInbox: function () {
      fileserver.cleanInbox()
        .then(() => {
          console.log('done')
        })
    },
    fetchFiles: function () {
      this.loading = true
      this.files = []

      fileserver.listFiles()
        .then(files => {
          this.files = files
          this.loading = false
        })
        .catch(err => {
          console.error(err)
          this.files = []
          this.error = 'Trouble connecting to file server.'
          this.loading = false
        })
    },
    trashFile: function (filename) {
      fileserver.files.trash('inbox', filename)
        .then(() => {
          var index = this.files.find(file => file.filename === filename)

          this.files.splice(index, 1)
        })
        .catch(err => {
          console.error(err)
        })
    },
    promptBeforeTrash: function (file) {
      this.fileToDelete = file
      this.modal = true
    },
    closeTrashModal: function (file) {
      if (file) this.trashFile(file.name)
      this.fileToDelete = {}
      this.modal = false
    },
    play: function (file) {
      if (file.name === this.playing) {
        return this.$refs.audio.paused ? this.$refs.audio.play() : this.pause()
      }

      this.buffering = file.name
      this.playing = ''

      fileserver.files.buffer('inbox', file.name).then(data => {
        this.buffering = ''
        this.playing = file.name

        this.$refs.audio.src = (window.URL).createObjectURL(new Blob([data]))
        this.$refs.audio.play()
      })
    },
    pause: function () {
      this.$refs.audio.pause()
    },
    onFileChange: function ($event) {

    }
  }
}
</script>

<style lang="stylus">
  #upload-btn:hover
    cursor: pointer

  input[type="file"]
    display: none
    
  .invisible
    opacity: 0
    
  .playing
    animation: 1s flashing infinite linear
    
  @keyframes flashing
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
</style>
