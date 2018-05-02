<template>
  <v-content>
    <v-container fluid>
        <v-layout>
          <v-flex xs8 offset-xs2>

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
  import { Dropbox } from 'dropbox'

  export default {
    name: 'Files',
    props: {
      state: Object
    },
    mounted: function () {
      var dbx = new Dropbox({ 
        accessToken: this.state.plugins.dropbox.token
      })

      dbx.filesListFolder({ path: '' }).then(res => {
        this.loading = false
        this.files = res.entries
      }).catch(console.error)
    },
    computed: {
    },
    filters: {
      toMB: function (value) {
        return ( value / (1000 * 1000) ).toFixed(2)
      }
    },
    data () {
      return {
        loading: true,
        headers: [{
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
    },
    components: {
      
    }
  }
</script>
