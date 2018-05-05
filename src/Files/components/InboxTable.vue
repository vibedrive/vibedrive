<template>
  <v-card flat>
    <v-card-title>

      <v-select
        label="~/Dropbox/Apps/Vibedrive/Inbox"
        disabled
      ></v-select>
      
      <v-spacer></v-spacer>

      <v-tooltip top color="black">
        <v-btn icon  color="white" depressed light slot="activator" @click="fetchFiles">
          <v-icon>cached</v-icon>
        </v-btn>
        <span>Refresh</span>
      </v-tooltip>


   <!--    <label small for="upload" id="upload-btn" class="btn teal accent-4">
        <div class="btn__content">Upload</div>
      </label> -->

    </v-card-title>

    <v-data-table
      :items="files"
      :headers="headers"
      :loading="loading"
      :no-data-text="loading ? '' : 'No files found.' "
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
        <td class="text-xs-left">
          {{ props.item.name }}
        </td>
        <td class="text-xs-right">
          {{ props.item.size | toMB }} MB
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
<!--     <input 
      type="file"
      id="upload"
      @change="onFileChange"
      style="display: none;"
      accept multiple> -->
  </v-card>
</template>

<script>
  import dropbox from '@/Shared/services/dropbox'

  export default {
    name: 'InboxTable',
    props: {
      
    },
    data: () => ({
      search: '',
      loading: true,
      modal: true,
      selected: [],
      rowsPerPage: [9],
      files: [],
      headers: [{
        sortable: false,
        width: 32,
        value: 'name'
      },{
        text: 'File Name',
        value: 'name'
      },{
        text: 'Size',
        width: 128,
        align: 'right',
        value: 'size'
      },{
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
      fetchFiles: async function () {
        if (dropbox.connected) {
          this.loading = true
          this.files = []

          var { entries } = await dropbox.listFiles()

          this.files = entries
          this.loading = false
        }
      },
      onFileChange: function ($event) {

      }
    },
    filters: {
      toMB: function (value) {
        return ( value / (1000 * 1000) ).toFixed(2)
      }
    }
  }
</script>

<style lang="stylus">
  #upload-btn:hover
    cursor: pointer
</style>
