<template>
  <v-card >
    <v-card-title>
      <h2>Traktor</h2>
    </v-card-title>

    <v-card-text>
      <p>
        Traktor folder:
        <pre>{{ traktor.filepath }}</pre>
        <br> 
      </p>
    </v-card-text>
    
    <v-card-actions>
      <v-btn light color="white" @click="locate">Find .nml</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import fileserver from '@/Services/fileserver'

export default {
  name: 'TraktorSettings',
  props: {
    
  },
  data: () => {
    return {
      traktor: {
        filepath: ''
      }
    }
  },
  components: {

  },
  methods: {
    locate () {
      fileserver.locateNML().then(filepath => {
        this.traktor.filepath = filepath
      })
    }
  },
  mounted: function () {
    
  }
}
</script>
