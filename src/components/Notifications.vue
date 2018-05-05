<template>
  <v-snackbar
    :timeout="error.timeout"
    color="red"
    top right
    multi-line vertical
    v-model="error.visible"
    @click.native="close">
    {{ error.text }}
  </v-snackbar>
</template>

<script>
  export default {
    name: 'Notifications',
    props: {
      error: Object
    },
    data: () => ({

    }),
    methods: {
      close () {
        this.error.visible = false
      }
    }
  }
</script>

