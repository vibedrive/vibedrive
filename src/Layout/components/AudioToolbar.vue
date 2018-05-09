<template>
  <div class="text-xs-center">
    <v-bottom-sheet value="true" hide-overlay full-width persistent>
      <AudioPlayer :state="state.player"></AudioPlayer>
    </v-bottom-sheet>
  </div>
</template>

<script>
import AudioPlayer from '@/Player/components/AudioPlayer'

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
