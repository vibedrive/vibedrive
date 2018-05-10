export default {
  namespaced: true,
  state: {
    status: 'paused',
    active: {
      playerId: 0,
      file: null
    },
    queued: {
      file: null,
      index: 0
    },
    file: null,
    queue: []
  },
  mutations: {
    setStatus (state, status) {
      state.status = status
    },
    load (state, file) {
      state.queue.file = file
    },
    swap (state) {
      state.active.playerId = state.active.playerId === 0 ? 1 : 0
    },
    setQueue (state, queue) {
      state.queue = queue
    },
    pushToQueue (state, item) {
      state.queue.push(item)
    }
  },
  actions: {
    load: function (context, file) {
      context.commit('load', file)
    },
    play: function (context) {
      if (!context.state.file) return

      context.commit('setStatus', 'playing')
    },
    pause: function (context) {
      if (!context.state.file) return

      context.commit('setStatus', 'paused')
    },
    prev: function (context) {
      var index = context.state.index - 1
      var file = context.state.queue[index]

      context.commit('load', { file })
    },
    next: function (context) {
      var index = context.state.index + 1
      var file = context.state.queue[index]

      context.commit('load', { file })
    },
    preview: function (context, file) {
      if (context.state.active.file && file.ino === context.state.active.file.ino) {
        return context.state.status === 'paused'
          ? context.dispatch('play')
          : context.dispatch('pause')
      }

      context.dispatch('load', file)
    },
    'queue:set': function (context, queue) {
      context.commit('setQueue', queue)
    },
    'queue:push': function (context, item) {
      context.commit('pushToQueue', item)
    },
    'el:loaded': function (context) {
      context.commit('swap')
    },
    'el:paused': function (context) {

    },
    'el:ended': function (context) {
      context.dispatch('next')
    }
  }
}
