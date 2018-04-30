<template>
  <div class="home">
    hello?
    <a class="button" :href="authenticationURL">
      Connect to Dropbox
    </a>

  </div>
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
