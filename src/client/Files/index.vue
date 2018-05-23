<template>
  <v-layout class="py-0">
    <v-flex class="" style="min-width: 270px; max-width: 270px">

    </v-flex>

    <v-flex>
      <FilesToolbar></FilesToolbar>

      <v-container fluid class="px-0 py-0">
           
        <InboxTable :items="files" :loading="loading" @remove="onRemove"></InboxTable>

      </v-container>

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

      <input 
        type="file"
        id="upload"
        @change="onFileChange"
        accept multiple>
    </v-flex>

  </v-layout>
</template>

<style lang="stylus" scoped>
  .files-page
    max-height: calc(100vh - 163px)
    overflow-y: scroll
    

  .tabs-bar .tabs__bar
    position: fixed
    width: 100%
    z-index: 3

</style>

<script>
import fileserver from '@/Services/fileserver'

import FilesToolbar from '@/Files/components/FilesToolbar'
import InboxTable from '@/Files/components/InboxTable'
import ArchivesTable from '@/Files/components/ArchivesTable'

export default {
  name: 'Files',
  props: {
    
  },
  data () {
    return {
      action: null,
      loading: true,
      files: [],
      dropdown_font: ['Clean'],
      selected: [],
      modal: false,
      fileToDelete: {}
    }
  },
  components: {
    FilesToolbar,
    InboxTable,
    ArchivesTable
  },
  methods: {
    onRemove: function (file) {
      var index = this.files.findIndex(f => f.ino === file.ino)

      this.files.splice(index, 1)
    },
    onSelectAction: function (action) {
      if (action) {
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
