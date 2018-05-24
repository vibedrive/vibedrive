<template>
  <v-toolbar dense flat color="grey darken-3">
    <v-select
      style="display: inline-block;"
      label="~/Dropbox/Apps/Vibedrive/Inbox"
      disabled
    ></v-select>

    <v-spacer></v-spacer>
    
    <v-tooltip top color="black">
      <v-btn slot="activator" @click="fetchFiles" color="white" small light :ripple="false">
        <v-icon>cached</v-icon>
        <span> </span>
      </v-btn>
      <span>Refresh</span>
    </v-tooltip>

    <v-menu attach="toolbar" offset-y light full-width>
      <v-btn slot="activator" ref="toolbar" color="white" small light :ripple="false">
        Actions
        <v-icon>arrow_drop_down</v-icon>
      </v-btn>
      <v-list light dense>
        <v-list-tile @click="cleanInbox">
          <v-list-tile-title>Clean Folder</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<style lang="stylus" scoped>

</style>

<script>
import fileserver from '@/Services/fileserver'

import InboxTable from '@/Files/components/InboxTable'
import ArchivesTable from '@/Files/components/ArchivesTable'

export default {
  name: 'FilesToolbar',
  props: {
    
  },
  data () {
    return {
      action: null,
      loading: true,
      files: [],
      dropdown_font: ['Clean'],
      selected: [],
      rowsPerPage: [3],
      modal: false,
      fileToDelete: {}
    }
  },
  components: {
    InboxTable,
    ArchivesTable
  },
  methods: {
    onSelectAction: function (action) {
      // if (action) {
      //   this.$refs.form.reset()
      // }
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
    onFileChange: function ($event) {

    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.fetchFiles()
    })
  }
}
</script>
