<template>
  <v-content>
    <v-container fluid>
        <v-layout>
          <v-flex xs8 offset-xs2>

            <div v-if="!dropboxIsConnected">
              <v-btn color="info" :href="authenticationURL">
                Connect to Dropbox
              </v-btn>
            </div v-if>

            <div v-if="dropboxIsConnected">
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
  import dropbox from '@/services/dropbox'

  export default {
    name: 'Profile',
    props: {
      state: Object
    },
    computed: {
      dropboxIsConnected: () => {
        return dropbox.isConnected()
      }
    },
    data () {
      return {
        authenticationURL: dropbox.authenticationURL
      }
    }
  }
</script>
