var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var nanostate = require('nanostate')

module.exports = Component

function Component (el) {
  if (!(this instanceof Component)) return new Component(el)

  var initialState = 'unmounted'

  this.el = el

  this.machine = nanostate(initialState, {
    unmounted: {},
    entering: {},
    entered: {},
    exiting: {},
    exited: {}
  })

  Nanocomponent.call(this)
}

Component.prototype = Object.create(Nanocomponent.prototype)

Component.prototype.createElement = function (state, emit) {
  return html`
    <body>
      <ul>
        <li><a href="/">/</a></li>
        <li><a href="/b">/b</a></li>
        <li><a href="/c">/c</a></li>
      </ul>
      ${this.el(state, emit)}
      ${this.nextEl ? this.nextEl(state, emit) : ''}
    </body>`
}

Component.prototype.update = function (state, emit) {
  return false
}

Component.prototype.to = function (el) {
  this.nextEl = el
  this.rerender()
}
