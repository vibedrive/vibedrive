<template>
  <v-content>
    <v-container fluid>
        <v-layout>
          <v-flex xs8 offset-xs2>
          </v-flex>
        </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import PlaylistsMenu from '@/components/PlaylistsMenu'

  export default {
    name: 'Tracks',
    mounted: function () {
    },
    computed: {
    },
    data () {
      return {
        
      }
    },
    components: {
      PlaylistsMenu
    }
  }
</script>
