export default {
  namespaced: true,
  state: {
    status: 'paused',
    buffering: false,
    file: null,
    queue: [],
    history: [],
    time: 0
  },
  mutations: {
    play (state) {
      state.buffering = false
      state.status = 'playing'
    },
    pause (state) {
      state.status = 'paused'
    },
    timeupdate (state, value) {
      state.time = value
    },
    setDuration (state, duration) {
      state.file.duration = duration
    },
    load (state, file) {
      state.buffering = true
      state.file = file
    },
    swap (state) {
      state.active.playerId = state.active.playerId === 0 ? 1 : 0
    },
    setQueue (state, queue) {
      state.queue = queue
    },
    pushToQueue (state, item) {
      state.queue.push(item)
    },
    concatQueue (state, queue) {
      state.queue = state.queue.concat(queue)
    },
    shiftQueue (state) {
      var first = state.queue.shift()

      state.history.push(first)
    },
    unshiftQueue (state) {
      var last = state.history.pop()
      var file = state.file

      state.queue.push(file)

      state.file = null
    }
  },
  actions: {
    load: function (context, file) {
      context.commit('load', file)
    },
    play: function (context) {
      if (!context.state.file) return

      context.commit('play')
    },
    pause: function (context) {
      if (!context.state.file) return

      context.commit('pause')
    },
    prev: function (context) {
      var file = context.state.history[context.state.history.length - 1]
      console.log(file)

      context.commit('unshiftQueue')
      context.dispatch('preview', file)
    },
    next: function (context) {
      var file = context.state.queue[0]

      context.commit('shiftQueue')
      context.dispatch('preview', file)
    },
    'set-duration': function (context, duration) {
      context.commit('setDuration', parseInt(duration))
    },
    preview: function (context, file, queue = []) {
      if (context.state.file && file.ino === context.state.file.ino) {
        return context.state.status === 'paused'
          ? context.dispatch('play')
          : context.dispatch('pause')
      }

      context.dispatch('pause')
      context.dispatch('load', file)
    },
    'queue:concat': function (context, queue) {
      context.commit('concatQueue', queue)
    },
    'queue:set': function (context, queue) {
      context.commit('setQueue', queue)
    },
    'queue:push': function (context, item) {
      context.commit('pushToQueue', item)
    },
    'el:timeupdate': function (context, $target) {
      var percent = ($target.currentTime / context.state.file.duration) * 100

      context.commit('timeupdate', percent)
    },
    'el:ended': function (context) {
      context.dispatch('next')
    },
    'el:canplay': function (context, id) {
      context.dispatch('play')
    }
  },
  getters: {
    status: state => state.status,
    file: state => state.file
  }
}
