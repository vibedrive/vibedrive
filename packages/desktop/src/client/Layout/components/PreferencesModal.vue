<template>
  <v-dialog v-model="visibility" lazy  origin="top right" full-width dark>
    <slot slot="activator"></slot>
    <v-card>
     
      <v-card-title class="headline">
        Preferences
      </v-card-title>

      <v-card-text>
        <h2>Integrations</h2>
        <v-list>
          
          <v-list-tile>

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

          </v-list-tile>

          <v-list-tile>
          </v-list-tile>
          <v-list-tile>
          </v-list-tile>
          <v-list-tile>
          </v-list-tile>
          <v-list-tile>
          </v-list-tile>

        </v-list>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
  import storage from 'local-storage'
  import dropbox from '@/Services/dropbox'
 
  export default {
    name: 'Preferences',
    props: {
      visible: Boolean,
      state: Object
    },
    computed: {
      visibility: {
        get: function onOpen () {
          this.dropboxIsConnected = dropbox.connected

          return this.visible
        },
        set: function onClose () {
          this.$emit('close')
        }
      }
    },
    data () {
      return {
        dropboxIsConnected: false,
        authenticationURL: dropbox.authenticationURL,
      }
    }
  }
</script>

