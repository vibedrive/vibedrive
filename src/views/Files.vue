<template>
  <v-content >
    <v-container fluid>
      <v-layout>
        <v-flex>

          <v-tabs v-model="active" color="grey darken-4" dark slider-color="teal accent-4">
            <v-tab key="inbox" ripple>Inbox</v-tab>
            <v-tab key="archives" ripple>Archives</v-tab>

            <v-tab-item key="inbox">
              <v-card flat>
                <v-card-title>
                  ~/Dropbox/Apps/Vibedrive/Inbox

                  <v-spacer></v-spacer>

                  <label for="upload" id="upload-btn" class="btn teal accent-4">
                    <div class="btn__content">Upload</div>
                  </label>
                </v-card-title>

                <v-data-table
                  :items="files"
                  :headers="headers"
                  :loading="loading"
                  :no-data-text="loading ? '' : 'No files found.' "
                  :rows-per-page-items="rowsPerPage"
                  dark>

                  <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>

                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">
                      <v-btn icon>
                        <v-icon>play_circle_outline</v-icon>
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
              </v-card>
            </v-tab-item>

            <v-tab-item key="archives">
              <v-card flat>
                
              </v-card>
            </v-tab-item>
          </v-tabs>

        </v-flex>
      </v-layout>
    </v-container>
    <input 
      type="file"
      id="upload"
      @change="onFileChange"
      style="display: none;"
      accept multiple>
  </v-content>
</template>

<style lang="stylus">
  #upload-btn:hover
    cursor: pointer
</style>

<script>
  import dropbox from '@/services/dropbox'
  import db from '@/services/db'
  import fileserver from '@/services/fileserver'

  export default {
    name: 'Files',
    props: {
      state: Object
    },
    components: {
      
    },
    mounted: function () {
      this.$nextTick(function () {
        this.fetchFiles()
      })
    },
    filters: {
      toMB: function (value) {
        return ( value / (1000 * 1000) ).toFixed(2)
      }
    },
    methods: {
      onFileChange: function ($event) {

      },
      fetchFiles: async function () {
        // var localFiles = await fileserver.files.list()
        var { entries } = await dropbox.listFiles()
        var tracks = await db.tracks.list()

        console.log('dropbox entries', entries)
        // console.log('localFiles', localFiles)

        var tracksByDropboxId = {}

        tracks.forEach(track => {
          tracksByDropboxId[track.identifiers.dropbox] = track
        })

        // var found, local

        this.files = entries.map(file => {
        //   found = tracksByDropboxId[file.id]
        //   local = localFiles.find(localFile => localFile.name === file.name)
          
        //   if (local) file.status = 'Available'

          return file
        })


        this.loading = false
      }
    },
    data () {
      return {
        loading: true,
        active: '0',
        modal: true,
        rowsPerPage: [9],
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
        }],
        files: []
      }
    }
  }
</script>
