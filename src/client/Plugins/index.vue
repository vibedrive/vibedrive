<template>
  <v-content class="py-0">
    <v-container fluid>
      
      <TraktorSettings></TraktorSettings>
    
    </v-container>
  </v-content>
</template>

<style lang="stylus">
  .tabs-bar .tabs__bar
    position: fixed
    width: 100%
    z-index: 3
</style>

<script>
import TraktorSettings from '@/Plugins/components/TraktorSettings'

export default {
  name: 'Plugins',
  props: {
    
  },
  components: {
    TraktorSettings
  }
}
</script>
