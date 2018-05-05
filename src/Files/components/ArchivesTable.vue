<template>
  <v-card flat>
    <v-card-title>

      <v-select
        label="~/Dropbox/Apps/Vibedrive/Archives"
        disabled
      ></v-select>
      
      <v-spacer></v-spacer>

      <v-tooltip top color="black">
        <v-btn icon  color="white" depressed light slot="activator" @click="fetchFiles">
          <v-icon>cached</v-icon>
        </v-btn>
        <span>Refresh</span>
      </v-tooltip>

    </v-card-title>

    <v-data-table
      :items="files"
      :headers="headers"
      :loading="loading"
      :no-data-text="loading ? '' : 'No files found.' "
      :rows-per-page-items="rowsPerPage"
      v-model="selected"
      item-key="name">

      <v-progress-linear slot="progress" color="teal" indeterminate></v-progress-linear>


      <template slot="headers" slot-scope="props">
        <th>
          
        </th>
      </template>

      <template slot="items" slot-scope="props">
        <td style="width: 32px">
          <v-checkbox
            v-model="props.selected"
            primary
            color="white"
            hide-details
          ></v-checkbox>
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
                <v-list-tile-title>Unarchive</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>

        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    name: 'ArchivesTable',
    props: {
      
    },
    data: () => ({
      loading: true,
      selected: [],
      rowsPerPage: [9],
      files: [],
      headers: [{
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
    methods: {
      fetchFiles () {

      }
    }
  }
</script>

