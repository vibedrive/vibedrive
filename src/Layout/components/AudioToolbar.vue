<template>
  <div class="text-xs-center">
    <v-bottom-sheet value="true" hide-overlay full-width persistent>
      <AudioPlayer 
        :active="$store.state.audio.active"
        :status="$store.state.audio.status">
          
        </AudioPlayer>
    </v-bottom-sheet>
  </div>
</template>

<script>
import AudioPlayer from '@/Audio/components/AudioPlayer'

export default {
  name: 'AudioToolbar',
  props: {
    state: Object
  },
  components: {
    AudioPlayer
  }
}
</script>
