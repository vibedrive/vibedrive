<template>
  <v-toolbar app fixed dense clipped-left flat class="black">
    <v-toolbar-title>
      <div>
        <span>Vibedrive</span>
      </div>
    </v-toolbar-title>

      <v-text-field
        light flat solo hide-details single-line
        prepend-icon="search" 
        style="min-width: 24rem;"
      ></v-text-field>
    

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn flat to="/files" :ripple="false">Files</v-btn>
      <v-btn flat to="/plugins" :ripple="false">Plugins</v-btn>
      <v-btn flat to="/tracks" :ripple="false">Tracks</v-btn>
    </v-toolbar-items>


    <v-menu color="white" light flat bottom lazy  min-width="240" :close-delay="0">
      <v-btn icon slot="activator" dark  :ripple="false">
        <v-icon>account_circle</v-icon>
      </v-btn>
      <v-list  class="white" light>
        <v-list-tile v-on:click="openPreferences">
          <v-list-tile-title >
            Preferences
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile to="/login">
          <v-list-tile-title>
            Log In
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile to="/upgrade">
          <v-list-tile-title>
            Upgrade to Plus 
            <v-icon small color="white">star</v-icon>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <Preferences 
      :state="state" 
      :visible="preferences" 
      v-on:close="closePreferences">
    </Preferences>
  </v-toolbar>
</template>

<style lang="stylus" scoped>
  .toolbar__title
    display: inline-block 
    min-width: 254px
    user-select: none
    
  .input-group.input-group--solo
    border-radius: 0

</style>

<script>
import Preferences from '@/Layout/components/PreferencesModal'

export default {
  name: 'Navbar',
  components: {
    Preferences
  },
  props: {
    state: Object
  },
  data: () => ({
    preferences: false
  }),
  methods: {
    openPreferences: function () {
      this.preferences = true
    },
    closePreferences: function () {
      this.preferences = false
    }
  }
}
</script>

