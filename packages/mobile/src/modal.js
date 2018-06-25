var Nanocomponent = require('nanocomponent')
var nanostate = require('nanostate')

module.exports = Component

function Component (el, opts) {
  if (!(this instanceof Component)) return new Component(el, opts)

  opts = opts || {}
  opts.classes = opts.classes || {}

  this._el = el
  this.opts = opts

  this.machine = nanostate('hidden', {
    hidden: { toggle: 'entering' },
    entering: { animationend: 'visible', toggle: 'leaving' },
    visible: { toggle: 'leaving' },
    leaving: { animationend: 'hidden', toggle: 'entering' }
  })

  this.machine.on('*', state => {
    if (state === 'visible' || state === 'hidden') {
      this.rerender()
    }
  })

  this._classes = Object.keys(this.machine.transitions).map(c => `modal-${c}`)

  Nanocomponent.call(this)
}

Component.prototype = Object.create(Nanocomponent.prototype)

Component.prototype.createElement = function (state, emit) {
  if (!this.el) this.el = this._el(state, emit)

  this.state = state
  this.emit = emit

  this._classes.forEach(c => this.el.classList.remove(this.opts.classes[c] || `${c}`))
  this.el.classList.add(this.opts.classes[this.machine.state] || `modal-${this.machine.state}`)

  return this.el
}

Component.prototype.load = function (el) {
  var events = ['animationend', 'webkitAnimationEnd', 'MozAnimationEnd', 'oAnimationEnd']

  events.forEach(event => {
    el.addEventListener(event, () => {
      this.machine.emit('animationend')
    })
  })
}

Component.prototype.update = function (state, emit) {
  if (!this.el) this.el = this._el(state, emit)

  this.state = state
  this.emit = emit

  return false
}

Component.prototype.toggle = function () {
  this.machine.emit('toggle')
  this.rerender()
}
