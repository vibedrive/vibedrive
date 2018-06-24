var html = require('choo/html')
var Nanocomponent = require('nanocomponent')

module.exports = Component

function Component (defaultRoute, childrenMapping) {
  if (!(this instanceof Component)) return new Component(defaultRoute, childrenMapping)

  this.children = childrenMapping
  this.duration = 1000

  Nanocomponent.call(this)
}

Component.prototype = Object.create(Nanocomponent.prototype)

Component.prototype.createElement = function (state, emit) {
  if (!this.el) {
    var currentRoute = prependSlash(state.route)
    var view = this.children[currentRoute]
    this.el = view(state, emit)
    this.el.classList.add('fadein')
  }

  return html`
    <body>
      <ul>
        <li><a href="/a">/a</a></li>
        <li><a href="/b">/b</a></li>
        <li><a href="/c">/c</a></li>
      </ul>
      currentEl: ${this.previousEl ? this.previousEl : this.el}
      <br>
      nextEl: ${this.nextEl ? this.nextEl : ''}
    </body>`
}

Component.prototype.afterupdate = function (el) {
  if (this.appearing) {
    setTimeout(() => {
      this.appearing = false
      this.previousEl = null
      this.el = this.nextEl
      this.nextEl = null
      this.rerender()
    }, this.duration)
  }
}

Component.prototype.update = function (state, emit) {
  this.state = state
  this.emit = emit

  if (state.previousRoute !== state.route) {
    var toRoute = prependSlash(state.route)

    this.previousEl = this.el

    this.previousEl.classList.remove('fadein')
    this.previousEl.classList.add('fadeout')

    var view = this.children[toRoute]
    this.nextEl = view(state, emit)

    this.nextEl.classList.remove('fadeout')
    this.nextEl.classList.add('fadein')

    this.appearing = true

    return true
  }

  return false
}

function prependSlash (str) {
  if (str && str[0] !== '/') return '/' + str
  return str
}
