export default {
  namespaced: true,
  state: {
    status: 'paused',
    buffering: false,
    file: null,
    index: 0,
    queue: []
  },
  mutations: {
    setStatus (state, status) {
      state.status = status
    },
    load (state, { file, index }) {
      state.file = file
      state.index = index
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
      this.commit('audio/load', { file })
    },
    'play': function (context) {
      if (!this.state.file) return
      this.commit('audio/setStatus', 'playing')
    },
    'pause': function (context) {
      this.commit('audio/setStatus', 'paused')
    },
    'prev': function (context) {
      var index = this.state.index - 1
      var file = this.state.queue[index]

      this.commit('load', {file, index})
    },
    'next': function (context) {
      var index = this.state.index + 1
      var file = this.state.queue[index]

      this.commit('load', file, index)
    },
    'queue:set': function (context, queue) {
      this.commit('audio/setQueue', queue)
    },
    'queue:push': function (context, item) {
      this.commit('audio/pushToQueue', item)
    },
    'el:loaded': function (context) {
      this.dispatch('audio/play')
    },
    'el:ended': function (context) {
      this.dispatch('audio/next')
    }
  }
}
