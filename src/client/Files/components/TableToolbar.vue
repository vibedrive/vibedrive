<template>
  <v-card>
    <v-card-title>
        <v-select
          label="~/Dropbox/Apps/Vibedrive/Inbox"
          disabled
        ></v-select>
        
        <v-spacer></v-spacer>

        <v-tooltip top color="black">
          <v-btn slot="activator" @click="fetchFiles"color="white" light :ripple="false">
            <v-icon>cached</v-icon>
            <span>Refresh</span>
          </v-btn>
          <span>Refresh</span>
        </v-tooltip>

      
        <v-menu offset-y light>
          <v-btn slot="activator" color="white"  light :ripple="false">
            Action
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list light dense>
            <v-list-tile @click="cleanInbox">
              <v-list-tile-title>Clean</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

  </v-card>
</template>

<script>
import fileserver from '@/Services/fileserver'

export default {
  name: 'TableToolbar',
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
    loading: true,
    modal: true,
    action: null,
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
    onFileChange: function ($event) {

    }
  }
}
</script>

<style lang="stylus">

</style>
