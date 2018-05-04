<template>
  <v-content>
    <v-container fluid>
      <v-layout>
        <v-flex>

          <v-card>
            <v-card-title>
              Soundcloud
            </v-card-title>

            <v-card-text>
                
              <div v-if="!soundcloudIsConnected">
                <v-btn color="orange" v-on:click="authenticate">
                  Connect to Soundcloud
                </v-btn>
              </div v-if>

              <div v-if="soundcloudIsConnected">
                <p> 
                  Connected to Soundcloud ( <a v-on:click="authenticate">reconnect?</a> )
                </p>
              </div>

            </v-card-text>

          </v-card>

        
        </v-flex>
      </v-layout>

    </v-container>
  </v-content>
</template>

<script>
  import soundcloud from '@/services/soundcloud'

  export default {
    name: 'SoundcloudStream',
    mounted () {
      this.$nextTick(function () {
        
      })
    },
    data: () => ({
      soundcloudIsConnected: false
    }),
    computed: {},
    methods: {
      authenticate () {
        soundcloud.connect().then(res => {
          console.log('cool', res)
          soundcloudIsConnected = true
        }).catch(err => console.log('oops'))
      }
    }
  }
</script>