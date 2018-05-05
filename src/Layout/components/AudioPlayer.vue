<template>
<!--   <v-toolbar dense fixed bottom>
    <v-btn icon>
      <v-icon>play_circle_filled</v-icon>
      
    </v-btn>
    <v-btn icon>
      <v-icon>pause_circle_filled</v-icon>
    </v-btn>
    <v-toolbar-title>No track</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar> -->

  <div class="text-xs-center">

    <v-bottom-sheet value="true" hide-overlay full-width persistent>
      <v-card tile>
        <v-progress-linear :value="50" height="3" class="my-0" color="teal accent-4"></v-progress-linear>
        <v-list class="grey darken-4">
          <v-list-tile >
            <v-list-tile-action>
              <v-btn icon>
                <v-icon>fast_rewind</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
              <v-btn icon>
                <v-icon>pause</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action :class="{ 'mr-3': $vuetify.breakpoint.mdAndUp }">
              <v-btn icon>
                <v-icon>fast_forward</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>The Walker</v-list-tile-title>
              <v-list-tile-sub-title>Fitz & The Trantrums</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    state: Object
  },
  components: {

  },
  mounted: function () {
    this.$nextTick(function () {

    })
  },
  filters: {
  },
  methods: {
  },
  data () {
    return {
    }
  }
}
</script>
