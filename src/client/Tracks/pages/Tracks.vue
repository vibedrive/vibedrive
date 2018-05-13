<template>
  <v-content>
    <v-container>
      <v-card>
        <v-card-text>
          
          <h2>tracks</h2>

          <ul>
            <li v-for="track in tracks">
              <pre>
                {{ track.files[0].name }}
              </pre>
            </li>
          </ul>

        </v-card-text>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>
  import db from '@/Services/db'
  import PlaylistsMenu from '@/Tracks/components/PlaylistsMenu'

  export default {
    name: 'Tracks',
    mounted: function () {
      db.tracks.list().then(tracks=> {
        this.tracks = tracks
      })
    },
    computed: {
    },
    data () {
      return {
        tracks: []
      }
    },
    components: {
      PlaylistsMenu
    }
  }
</script>
