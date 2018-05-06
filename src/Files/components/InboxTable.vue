<template>
  <v-card flat>
    <v-card-title>
        <v-select
          label="~/Dropbox/Apps/Vibedrive/Inbox"
          disabled
        ></v-select>
        
        <v-spacer></v-spacer>

        <v-tooltip top color="black">
          <v-btn  slot="activator" @click="fetchFiles">
            <v-icon>cached</v-icon>
            <span>Refresh</span>
          </v-btn>
          <span>Refresh</span>
        </v-tooltip>

      
        <v-menu offset-y light>
          <v-btn color="white"  slot="activator"  light>
            Action
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-list light dense>
            <v-list-tile @click="cleanInbox">
              <v-list-tile-title>Clean</v-list-tile-title>
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
      select-all="white">

      <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

      <template slot="items" slot-scope="props">
        <td style="width: 32px">
          <v-checkbox
            v-model="props.selected"
            primary
            color="white"
            hide-details
          ></v-checkbox>
        </td>

        <td class="px-0">
          <v-btn icon>
            <v-icon>play_circle_filled</v-icon>
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
  #upload-btn:hover
    cursor: pointer

  input[type="file"]
    display: none
</style>
