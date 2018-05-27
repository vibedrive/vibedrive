export default {
  namespaced: true,
  state: {
    playlists: []
  },
  mutations: {
    create (state, playlist) {
      state.playlists.push(playlist)
    },
    list (state, playlists) {
      state.playlists = playlists
    },
    delete (state, playlistId) {
      var index = state.playlists.findIndex(p => p._id === playlistId)

      if (index > -1) {
        state.playlists.splice(index, 1)
      }
    }
  },
  actions: {
    create (context, playlist) {
      context.commit('create', playlist)
    },
    list (context, playlists) {
      context.commit('list', playlists)
    },
    delete (context, playlistId) {
      context.commit('delete', playlistId)
    }
  }
}
