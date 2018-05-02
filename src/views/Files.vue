<template>
  <v-content>
    <v-container fluid>
        <v-layout>
          <v-flex xs8 offset-xs2>

            <v-data-table
              :items="files"
              :headers="headers"
              :loading="true"
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

  export default {
    name: 'Files',
    mounted: function () {
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
        files: [
          { name: 'file-A.mp3', size: 10470175 },
          { name: 'file-B.mp3', size: 5730264 },
          { name: 'file-C.mp3', size: 8310374 }
        ]
      }
    },
    components: {
      
    }
  }
</script>
