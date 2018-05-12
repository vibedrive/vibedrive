<template>
  <v-content class="py-0">
    <v-container fluid class="py-0 px-0 grey darken-3">
      <v-layout>
        <v-flex>
          <v-tabs 
            v-model="active" 
            height="48" 
            color="grey darken-4"
            class="tabs-bar"  
            slider-color="teal accent-4"
            dark >

            <v-tab key="inbox" :ripple="false">Inbox</v-tab>
            <v-tab-item key="inbox">
              <InboxTable class="mt-5"></InboxTable>
            </v-tab-item>

            <v-tab key="library" :ripple="false">Library</v-tab>
            <v-tab-item key="library">
              <div></div>
            </v-tab-item>

            <v-tab key="archives" :ripple="false">Archives</v-tab>
            <v-tab-item key="archives">
              <ArchivesTable></ArchivesTable>
            </v-tab-item>

            <v-tab key="unsupported" :ripple="false">Unsupported</v-tab>
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

<style lang="stylus">
  .tabs-bar .tabs__bar
    position: fixed
    width: 100%
    z-index: 3
</style>

<script>
import InboxTable from '@/Files/components/InboxTable'
import ArchivesTable from '@/Files/components/ArchivesTable'

export default {
  name: 'Files',
  props: {
    
  },
  components: {
    InboxTable,
    ArchivesTable
  },
  methods: {
  },
  mounted: function () {
    console.log('files', this)
  },
  data () {
    return {
      active: '0'
    }
  }
}
</script>
