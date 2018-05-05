<template>
  <v-toolbar dense >
    <v-btn icon>
      <v-icon>play_circle_filled</v-icon>
      
    </v-btn>
    <v-btn icon>
      <v-icon>pause_circle_filled</v-icon>
    </v-btn>
    <v-toolbar-title>No track</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
</template>

<script>
  import dropbox from '@/Shared/services/dropbox'

  export default {
    name: 'AudioPlayer',
    props: {
      state: Object
    },
    components: {
      
    },
    mounted: function () {
      this.$nextTick(function () {
        
      })
    },
    filters: {
    },
    methods: {
    },
    data () {
      return {
      }
    }
  }
</script>
