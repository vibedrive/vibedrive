var html = require('choo/html')
// var playerView = require('./player.view')
// var trackList = require('./modal')(trackListEl, {

// })

// var Transition = require('./Transition')
var TransitionGroup = require('./TransitionGroup')

module.exports = routes

function routes () {
  return function (state, emitter, app) {
    var routeMapping = {
      '/a': wrapper(viewA),
      '/b': wrapper(viewB),
      '/c': wrapper(viewC)
    }

    var group = TransitionGroup('/', routeMapping)

    Object.keys(routeMapping).forEach(route => {
      app.route(route, group.render.bind(group))
    })
  }
}

function wrapper (el) {
  return function (state, emit) {
    return el(state, emit)
  }
}

function viewA (state, emit) {
  return html`<span style="color: red;">A</span>`
}

function viewB (state, emit) {
  return html`<span style="color: blue;">B</span>`
}

function viewC (state, emit) {
  return html`<span style="color: green;">C</span>`
}

// function mainView (state, emit) {
//   return html`
//       <body class="vh-100 overflow-y-hidden">
//         ${navigationBar(state, emit)}
//         <a href="/abc">/abc</a>
//         <a href="/def">/def</a>
//         ${scrollView(state, emit)}
//         ${trackList.render(state, emit)}
//         ${tabBar(state, emit)}
//         ${playerView.render(state, emit)}
//       </body>`
// }

// function navigationBar (state, emit) {
//   var toggledClass = on => on ? 'bg-gray white' : ''

//   return html`
//     <nav class="fixed mt3 top-0 h3 w-100 bg-black flex justify-center items-center">
//       <div class="br3 h2">
//         <button class="h-100 br1 ph3 br--left ${toggledClass(!state.storageSource)}"
//           onmouseup=${e => toggle(e, 0)}
//           ontouchend=${e => toggle(e, 0)}>
//           Cloud
//         </button>
//         <button class="h-100 br1 ph3 br--right ${toggledClass(state.storageSource)}"
//           onmouseup=${e => toggle(e, 1)}
//           ontouchend=${e => toggle(e, 1)}>
//           Device
//         </button>
//       </div>
//     </nav>`

//   function toggle (e, val) {
//     emit('select-storage-source', val)
//   }
// }

// function scrollView (state, emit) {
//   return html`
//     <main class="mt6">
//       <ul class="list pa0 bt b--gray">
//         ${state.playlists.map(playlist => html`
//             <li>
//               <button class="w-100 h3 pa2 bb b--gray"
//                 ontouchend=${e => select(playlist)}
//                 onmouseup=${e => select(playlist)}>
//                 ${playlist.title}
//               </button>
//             </li>
//           `)}
//       </ul>
//     </main>`

//   function select (playlist) {

//   }
// }

// function trackListEl (state, emit) {
//   return html`
//     <div>
//       <ul class="list pa0 bt b--gray">
//       </ul>
//     </div>`
// }

// function tabBar (state, emit) {
//   return html`
//     <nav class="flex justify-center fixed bottom-0 h3 w-100 bt bw1 b--black">
//       <div class="block bg-blue h3 w3"
//         onmouseup=${click}
//         ontouchend=${click}>
//       </div>
//     </nav>`

//   function click (e) {
//     playerView.toggle()
//   }
// }
