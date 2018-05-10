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
    <audio ref="0" @canplay="onCanPlay()" @ended="onEnded()"></audio>
    <audio ref="1" @canplay="onCanPlay()" @ended="onEnded()"></audio>
  </v-card>
</template>

<script>
import fileserver from '@/Files/services/fileserver'
import renderAudio from '@/lib/render-audio'

export default {
  name: 'AudioPlayer',
  props: {
    active: Object,
    status: String
  },
  computed: {
    $active: function () {
      return this.$refs[this.active.playerId]
    }
  },
  watch: {
    file: function (file, oldFile) {
      fileserver.files.buffer('inbox', file.name)
        .then(stream => renderAudio(file.name, stream, this.$refs.audio))
        .then(() => this.$store.dispatch('audio/el:loaded'))
        .catch(console.error)
    },
    status: function (value, oldValue) {
      if (value === 'playing') {
        this.$active.play()
      } else {
        this.$active.pause()
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
    },
    onCanPlay: function (e) {
      this.$store.dispatch('audio/el:canplay', e.target.ref)
    },
    onEnded: function (e) {
      this.$store.dispatch('audio/el:ended', e.target.ref)
    }
  }
}
</script>
