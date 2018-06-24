<template>
  <v-dialog v-model="visibility" lazy origin="top right" dark width="480">
    <v-form @submit="login" ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title class="headline">
          Log in to your account
        </v-card-title>

        <v-card-text>
          <v-subheader>Username</v-subheader>
          <v-text-field
            v-model="username"
            class="black"
            required solo dark flat
          ></v-text-field>
          <v-subheader>Password</v-subheader>
          <v-text-field
            v-model="password"
            class="black"
            type="password"
            required solo dark flat
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
          <v-btn 
            :disabled="!valid" 
            @click="login" 
            :loading="loading"
            role="submit"
            class="white" 
            flat 
            :ripple="false">Log in</v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
  import db from '@/Services/db'
 
  export default {
    name: 'LoginModal',
    props: {
      visible: Boolean
    },
    watch: {
      visibility (val) {
        !val && this.$emit('close')
      }
    },
    computed: {
      visibility: {
        get: function () {
          return this.visible
        },
        set: function (value) {
          this.$emit('close')
        }
      }
    },
    data () {
      return {
        valid: true,
        loading: false,
        username: 'myuser',
        password: 'mypassword'
      }
    },
    methods: {
      login (e) {
        if (this.$refs.form.validate()) {
          this.loading = true 
          
          db.login(this.username, this.password)
            .then(() => {
              this.loading = false 
              this.$refs.form.reset()
              this.visibility = false
            })
            .catch(err => {
              alert(err)
              console.error(err)
              this.loading = false 
              this.$refs.form.reset()
              this.visibility = false
            })
        }
      }
    }
  }
</script>

