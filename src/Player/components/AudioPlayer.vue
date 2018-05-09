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
            <v-icon>pause</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-action>

          <v-btn @click="playOrPause()" :ripple="false" icon >
            <v-icon>fast_forward</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-content>

          <v-list-tile-title>{{ playing.name }}</v-list-tile-title>
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
import store from '/store' 
import bus from '@/bus'

export default {
  name: 'AudioPlayer',
  props: {
    state: Object
  },
  data () {
    return {
      store: store,
      buffering: null,
      playing: null,
      loading: true
    }
  },
  created: function () {
    bus.$on('audio:play', this.play)
    bus.$on('audio:pause', this.pause)
    bus.$on('audio:prev', this.prev)
    bus.$on('audio:next', this.next)
    bus.$on('audio:load', this.load)
    bus.$on('audio:queue', this.queue)
  },
  methods: {
    play: function (file) {
      this.$refs.audio.play()
    },
    pause: function () {
      this.$refs.audio.pause()
    },
    playOrPause: function () {
      this.$refs.audio.paused
        ? this.play()
        : this.pause()
    },
    load: function (file) {
      this.buffering = file
      this.playing = null

      store.dispatch('loading')

      return fileserver.files.buffer('inbox', file.name)
        .then(stream => renderAudio(file.name, stream, this.$refs.audio))
        .then(() => {
          this.buffering = null
          this.playing = file

          store.dispatch('loaded')

          return file
        })
        .catch(console.error)
    },
    loadNext: function () {
      var currentIndex = this.files.findIndex(file => file.name === this.playing)
      var nextFile = this.files[currentIndex + 1]

      this.load(nextFile).then(() => this.play())
    },
    onPaused: function () {
      store.dispatch('paused')
    },
    onEnded: function (e) {
      store.dispatch('ended')

      this.loadNext()
    }
  }
}
</script>
