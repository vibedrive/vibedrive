<template>
  <v-card tile>
    <v-progress-linear 
      :value="$store.state.audio.time" 
      height="3" 
      class="my-0" 
      color="teal accent-4">  
    </v-progress-linear>

    <v-list class="grey darken-4">
      <v-list-tile >
        <v-list-tile-action>

          <v-btn @click="prev()" :ripple="false" icon>
            <v-icon>fast_rewind</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-action>

          <v-btn @click="playOrPause()" :ripple="false" icon>
            <v-icon>{{ status === 'paused' ? 'play_arrow' : 'pause' }}</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-action>

          <v-btn @click="playOrPause()" :ripple="false" icon >
            <v-icon>fast_forward</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-content>

          <v-list-tile-title>{{ file ? file.name : 'No file' }}</v-list-tile-title>
          <v-list-tile-sub-title></v-list-tile-sub-title>

        </v-list-tile-content>
        <v-spacer></v-spacer>
      </v-list-tile>
    </v-list>
    <audio ref="audio" 
      @canplay="$store.dispatch('audio/el:canplay')" 
      @ended="$store.dispatch('audio/el:ended')"
      @timeupdate="$store.dispatch('audio/el:timeupdate', $event.target)">  
    </audio>
  </v-card>
</template>

<script>
import fileserver from '@/Files/services/fileserver'
import renderAudio from '@/lib/render-audio'
import { mapGetters } from 'vuex'

export default {
  name: 'AudioPlayer',
  computed: {
    ...mapGetters({
      file: 'audio/file',
      status: 'audio/status'
    })
  },
  watch: {
    file: function (file, oldFile) {
      fileserver.files.buffer('inbox', file.name)
        .then(({stream, info}) => {
          this.$store.dispatch('audio/set-duration', info.duration)

          renderAudio(file.name, stream, this.$refs.audio)
        })
        .catch(console.error)
    },
    status: function (value, oldValue) {
      if (value === 'playing') {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    }
  },
  methods: {
    play: function (file) {
      this.$store.dispatch('audio/play')
    },
    pause: function () {
      this.$store.dispatch('audio/pause')
    },
    playOrPause: function () {
      this.status === 'paused' ? this.play() : this.pause()
    }
  }
}
</script>
