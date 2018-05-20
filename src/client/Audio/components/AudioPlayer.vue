<template>
  <v-card tile id="audio-player">
    <v-progress-linear 
      :value="$store.state.audio.progress" 
      height="3" 
      class="my-0" 
      color="teal accent-4">  
    </v-progress-linear>

    <v-list class="black">
      <v-list-tile>
        <v-list-tile-action >
          <div class="cover-art"></div>

        </v-list-tile-action>
        <v-list-tile-action>

          <v-btn @click="$store.dispatch('audio/prev')" :ripple="false" icon>
            <v-icon>fast_rewind</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-action>

          <v-btn @click="playOrPause()" :loading="$store.state.audio.buffering" :ripple="false" icon>
            <v-icon>{{ status === 'paused' ? 'play_arrow' : 'pause' }}</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-action>

          <v-btn @click="$store.dispatch('audio/next')" :ripple="false" icon >
            <v-icon>fast_forward</v-icon>
          </v-btn>

        </v-list-tile-action>
        <v-list-tile-content>

          <v-list-tile-title>{{ file ? file.name : 'No file' }}</v-list-tile-title>
          <v-list-tile-sub-title></v-list-tile-sub-title>

        </v-list-tile-content>
        <v-spacer></v-spacer>
        <v-list-tile-action>

<!--           <v-menu
            transition="scale-y-transition"
            :value="true"
           class="invisible"
            top offset-y>
            <v-btn  slot="activator" :ripple="false" icon >
              <v-icon>view_list</v-icon>
            </v-btn>

            <v-card>
              <v-toolbar  dark>
                <v-toolbar-title>Next up</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn slot="activator" icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list>
                <v-list-tile v-for="item in $store.state.audio.queue" :key="item.title" avatar @click="">

                  <v-list-tile-avatar>
                    <img :src="item.avatar">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.name"></v-list-tile-title>
                  </v-list-tile-content>

                </v-list-tile>
              </v-list>
            </v-card>
          </v-menu>
 -->
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <audio ref="audio" 
      @canplay="$store.dispatch('audio/el:canplay')" 
      @ended="$store.dispatch('audio/el:ended')"
      @timeupdate="$store.dispatch('audio/el:timeupdate', $event.target)">  
    </audio>
  </v-card>
</template>

<style lang="stylus" scoped>
      
  .playback-history
    max-width: 40rem
    max-height: 40rem
  
</style>

<script>
import fileserver from '@/Services/fileserver'
import renderAudio from '@/Audio/lib/render-audio'
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
    playOrPause: function () {
      this.status === 'paused' 
        ? this.$store.dispatch('audio/play') 
        : this.$store.dispatch('audio/pause')
    }
  }
}
</script>
