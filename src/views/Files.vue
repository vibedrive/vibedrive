<template>
  <v-content>
    <v-container fluid>
        <v-layout>
          <v-flex>

            <div class="title mb-3">Dropbox</div>

            <v-data-table
              :items="files"
              :headers="headers"
              :loading="loading"
              :no-data-text="loading ? '' : 'No files found.' "
              hide-actions
              dark>
 
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>

              <template slot="items" slot-scope="props">
                <td class="text-xs-left">
                  {{ props.item.id }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.status }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.name }}
                </td>
                <td class="text-xs-right">
                  {{ props.item.size | toMB }} MB
                </td>
                <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </td>
              </template>

            </v-data-table>

          </v-flex>
        </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import dropbox from '@/services/dropbox'
  import db from '@/services/db'

  export default {
    name: 'Files',
    props: {
      state: Object
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
      fetchFiles: async function () {
        var { entries } = await dropbox.folders.list()
        var tracks = await db.tracks.list()

        var tracksByDropboxId = {}

        tracks.forEach(track => {
          tracksByDropboxId[track.identifiers.dropbox] = track
        })

        var found

        this.files = entries.map(file => {
          found = tracksByDropboxId[file.id]
          file.status = found ? found.status : 'Untracked'

          return file
        })

        this.loading = false
      }
    },
    data () {
      return {
        loading: true,
        headers: [{
          text: 'Id',
          value: 'id'
        },{
          text: 'Status',
          value: 'status'
        },{
          text: 'File Name',
          value: 'name'
        },{
          text: 'Size',
          width: '128',
          align: 'right',
          value: 'size'
        },{
          sortable: false,
          width: '32',
          value: 'name'
        }],
        files: []
      }
    }
  }
</script>
