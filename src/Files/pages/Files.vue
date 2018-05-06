<template>
  <v-content class="py-0">
    <v-container fluid class="py-0 px-0">
      <v-layout>
        <v-flex>
          <v-tabs height="48" v-model="active" color="grey darken-3"  dark slider-color="teal accent-4">

            <v-tab key="inbox"  :ripple="false">Inbox</v-tab>
            <v-tab-item key="inbox">
              <InboxTable></InboxTable>
            </v-tab-item>

            <v-tab key="library"  :ripple="false">Library</v-tab>
            <v-tab-item key="library">
              <div></div>
            </v-tab-item>

            <v-tab key="archives"  :ripple="false">Archives</v-tab>
            <v-tab-item key="archives">
              <ArchivesTable></ArchivesTable>
            </v-tab-item>

            <v-tab key="unsupported"  :ripple="false">Unsupported</v-tab>
            <v-tab-item key="unsupported">
              <div></div>
            </v-tab-item>

          </v-tabs>
        </v-flex>
      </v-layout>
      <div style="height: 4.75em;"></div>
    </v-container>
  </v-content>
</template>

<style lang="stylus" scoped>
  .tabs__bar 
    position: fixed
</style>

<script>
import InboxTable from '@/Files/components/InboxTable'
import ArchivesTable from '@/Files/components/ArchivesTable'

export default {
  name: 'Files',
  props: {
    state: Object
  },
  components: {
    InboxTable,
    ArchivesTable
  },
  methods: {
  },
  data () {
    return {
      active: '0'
    }
  }
}
</script>
