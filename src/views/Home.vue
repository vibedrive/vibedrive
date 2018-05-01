<template>
  <v-container fluid fill-height>
    <v-layout>
      <div class="home">
        <v-btn color="info" :href="authenticationURL">
          Connect to Dropbox
        </v-btn>
      </div>
    </v-layout>
  </v-container>
</template>

<script>

  export default {
    name: 'home',
    mounted: function () {
    },
    computed: {
      authenticationURL: function () { 
        return this.dbx.getAuthenticationUrl('http://localhost:8080') 
      }
    },
    data () {
      return {
        
      }
    },
    components: {
      
    }
  }
</script>
