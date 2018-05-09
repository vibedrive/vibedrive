<template>
  <v-card tile>
    <v-progress-linear :value="50" height="3" class="my-0" color="teal accent-4"></v-progress-linear>
    <v-list class="grey darken-4">
      <v-list-tile >
        <v-list-tile-action>

          <v-btn @click="prev()" :ripple="false" icon>
            <v-icon>fast_rewind</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-action>

          <v-btn @click="playOrPause()" :ripple="false" icon>
            <v-icon>{{ status === 'paused' ? 'pause' : 'play_arrow' }}</v-icon>
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
      @pause="onPaused()"
      @ended="onEnded()"></audio>
  </v-card>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    file: Object,
    status: String
  },
  data () {
    return {

    }
  },
  watch: {
    file: function (file, oldFile) {
      fileserver.files.buffer('inbox', file.name)
        .then(stream => renderAudio(file.name, stream, this.$refs.audio))
        .then(() => this.$store.dispatch('audio:loaded'))
        .catch(console.error)
    },
    status: function (value, oldValue) {
      return value === 'playing'
        ? this.play()
        : this.pause()
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
    },
    onPaused: function () {
      this.$store.dispatch('audio/el:paused')
    },
    onEnded: function (e) {
      this.$store.dispatch('audio/el:ended')
    }
  }
}
</script>
