var html = require('choo/html')
var playerModal = require('./modal')(playerView)

module.exports = playerModal

function playerView (state, emit) {
  return html`
    <div class="modal">
      <div>
        <p>Artist</p>
        <p>Title</p>
      </div>

      <div class="waveform"></div>

      <div class="cover-bg"></div>

      <nav class=" h3 w-100 fixed bottom-0">
        <button class="w3 h3" 
          onmouseup=${e => playerModal.toggle()} 
          ontouchend=${e => playerModal.toggle()}>
          Hide
        </button>
      </nav>
    </div>`
}
