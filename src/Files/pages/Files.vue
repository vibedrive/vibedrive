<template>
  <v-content >
    <v-container fluid>
      <v-layout>
        <v-flex>
          <v-tabs v-model="active" color="grey darken-4" dark slider-color="teal accent-4">
            <v-tab key="inbox" ripple>Inbox</v-tab>
            <v-tab key="archives" ripple>Archives</v-tab>

            <v-tab-item key="inbox">
              <InboxTable></InboxTable>
            </v-tab-item>

            <v-tab-item key="archives">
              <ArchivesTable></ArchivesTable>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import InboxTable from '@/Files/components/InboxTable'
  import ArchivesTable from '@/Files/components/ArchivesTable'

  export default {
    name: 'Files',
    props: {
      state: Object
    },
    components: {
      InboxTable,
      ArchivesTable
    },
    methods: {
    },
    data () {
      return {
        active: '0',
      }
    }
  }
</script>
