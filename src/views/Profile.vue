<template>
  <v-content>
    <v-container fluid>
        <v-layout>
          <v-flex xs8 offset-xs2>

            <div v-if="!state.plugins.dropbox.token">
              <v-btn color="info" :href="authenticationURL">
                Connect to Dropbox
              </v-btn>
            </div v-if>

            <div v-if="state.plugins.dropbox.token">
              <p> 
                Connected to Dropbox ( <a :href="authenticationURL">reconnect?</a> )
              </p>
            </div>

          </v-flex>
        </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import storage from 'local-storage'

  export default {
    name: 'home',
    props: {
      state: Object
    },
    mounted: function () {
    },
    computed: {
      authenticationURL: function () {
        return this.dbx.getAuthenticationUrl('http://localhost:8080/dbx') 
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
