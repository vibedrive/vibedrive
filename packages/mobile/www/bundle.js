(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":54}],2:[function(require,module,exports){
var trailingNewlineRegex = /\n[\s]+$/
var leadingNewlineRegex = /^\n[\s]+/
var trailingSpaceRegex = /[\s]+$/
var leadingSpaceRegex = /^[\s]+/
var multiSpaceRegex = /[\n\s]+/g

var TEXT_TAGS = [
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'data', 'dfn', 'em', 'i',
  'kbd', 'mark', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'amp', 'small', 'span',
  'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr'
]

var CODE_TAGS = [
  'code', 'pre'
]

module.exports = function appendChild (el, childs) {
  if (!Array.isArray(childs)) return

  var nodeName = el.nodeName.toLowerCase()

  var hadText = false
  var value, leader

  for (var i = 0, len = childs.length; i < len; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      appendChild(el, node)
      continue
    }

    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      typeof node === 'function' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }

    var lastChild = el.childNodes[el.childNodes.length - 1]

    // Iterate over text nodes
    if (typeof node === 'string') {
      hadText = true

      // If we already had text, append to the existing text
      if (lastChild && lastChild.nodeName === '#text') {
        lastChild.nodeValue += node

      // We didn't have a text node yet, create one
      } else {
        node = document.createTextNode(node)
        el.appendChild(node)
        lastChild = node
      }

      // If this is the last of the child nodes, make sure we close it out
      // right
      if (i === len - 1) {
        hadText = false
        // Trim the child text nodes if the current node isn't a
        // node where whitespace matters.
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          CODE_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        } else if (CODE_TAGS.indexOf(nodeName) === -1) {
          // The very first node in the list should not have leading
          // whitespace. Sibling text nodes should have whitespace if there
          // was any.
          leader = i === 0 ? '' : ' '
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, leader)
            .replace(leadingSpaceRegex, ' ')
            .replace(trailingSpaceRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

    // Iterate over DOM nodes
    } else if (node && node.nodeType) {
      // If the last node was a text node, make sure it is properly closed out
      if (hadText) {
        hadText = false

        // Trim the child text nodes if the current node isn't a
        // text node or a code node
        if (TEXT_TAGS.indexOf(nodeName) === -1 &&
          CODE_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')

          // Remove empty text nodes, append otherwise
          if (value === '') {
            el.removeChild(lastChild)
          } else {
            lastChild.nodeValue = value
          }
        // Trim the child nodes if the current node is not a node
        // where all whitespace must be preserved
        } else if (CODE_TAGS.indexOf(nodeName) === -1) {
          value = lastChild.nodeValue
            .replace(leadingSpaceRegex, ' ')
            .replace(leadingNewlineRegex, '')
            .replace(trailingNewlineRegex, '')
            .replace(multiSpaceRegex, ' ')
          lastChild.nodeValue = value
        }
      }

      // Store the last nodename
      var _nodeName = node.nodeName
      if (_nodeName) nodeName = _nodeName.toLowerCase()

      // Append the node to the DOM
      el.appendChild(node)
    }
  }
}

},{}],3:[function(require,module,exports){
var hyperx = require('hyperx')
var appendChild = require('./appendChild')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]

var COMMENT_TAG = '!--'

var SVG_TAGS = [
  'svg', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
  'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
  'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
  'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
  'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
  'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image',
  'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph',
  'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  appendChild(el, children)
  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"./appendChild":2,"hyperx":25}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],6:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  get: function () {
    if (!(this instanceof Buffer)) {
      return undefined
    }
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (ArrayBuffer.isView(buf)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":7,"ieee754":26}],7:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],8:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter

var storage = require('./lib/storage')
var logger = require('./lib/logger')
var debug = require('./lib/debug')
var copy = require('./lib/copy')
var help = require('./lib/help')
var log = require('./lib/log')
var getAllRoutes = require('wayfarer/get-all-routes')

module.exports = expose

function expose () {
  store.storeName = 'choo-devtools'
  return store
  function store (state, emitter, app) {
    var localEmitter = new EventEmitter()

    // We should start the logger before DOM is loaded.
    if (typeof window !== 'undefined') {
      logger(state, emitter, app)
    }

    emitter.on('DOMContentLoaded', function () {
      if (typeof window === 'undefined') return
      window.choo = {}

      window.choo.state = state
      window.choo.emit = function (eventName, data) {
        emitter.emit(eventName, data)
      }
      window.choo.on = function (eventName, listener) {
        emitter.on(eventName, listener)
      }

      debug(state, emitter, app, localEmitter)

      log(state, emitter, app, localEmitter)
      window.choo.copy = copy
      if (app.router && app.router.router) {
        window.choo.routes = Object.keys(getAllRoutes(app.router.router))
      }

      storage()
      help()
    })
  }
}

},{"./lib/copy":9,"./lib/debug":10,"./lib/help":11,"./lib/log":12,"./lib/logger":13,"./lib/storage":14,"events":5,"wayfarer/get-all-routes":55}],9:[function(require,module,exports){
var stateCopy = require('state-copy')
var pluck = require('plucker')

module.exports = copy

function copy (state) {
  var isStateString = state && typeof state === 'string'
  var isChooPath = isStateString && arguments.length === 1 && state.indexOf('state.') === 0

  if (!state || typeof state === 'function') state = window.choo.state
  if (isChooPath) [].push.call(arguments, {state: window.choo.state})

  stateCopy(isStateString ? pluck.apply(this, arguments) : state)
}

},{"plucker":45,"state-copy":51}],10:[function(require,module,exports){
var onChange = require('object-change-callsite')
var nanologger = require('nanologger')
var assert = require('assert')

var enabledMessage = 'Debugging enabled. To disable run: `choo.debug = false`'
var disabledMessage = 'Debugging disabled. We hope it was helpful! 🙌'

module.exports = debug

function debug (state, emitter, app, localEmitter) {
  var log = nanologger('choo-devtools')
  var enabled = window.localStorage.logLevel === 'debug'
  if (enabled) log.info(enabledMessage)

  state = onChange(state, function (attr, value, callsite) {
    if (!enabled) return
    callsite = callsite.split('\n')[1].replace(/^ +/, '')
    log.info(`state.${attr}`, value, '\n' + callsite)
  })

  app.state = state

  Object.defineProperty(window.choo, 'debug', {
    get: function () {
      window.localStorage.logLevel = 'debug'
      localEmitter.emit('debug', true)
      enabled = true
      return enabledMessage
    },
    set: function (bool) {
      assert.equal(typeof bool, 'boolean', 'choo-devtools.debug: bool should be type boolean')
      window.localStorage.logLevel = bool ? 'debug' : 'info'
      enabled = bool
      localEmitter.emit('debug', enabled)
      if (enabled) log.info(enabledMessage)
      else log.info(disabledMessage)
    }
  })
}

},{"assert":1,"nanologger":33,"object-change-callsite":42}],11:[function(require,module,exports){
module.exports = help

function help () {
  Object.defineProperty(window.choo, 'help', {
    get: get,
    set: noop
  })

  function get () {
    setTimeout(function () {
      print('copy', 'Serialize the current state to the clipboard.')
      print('debug', 'Enable Choo debug mode.')
      print('emit', 'Emit an event in the Choo emitter.')
      print('help', 'Print usage information.')
      print('log', 'Print the last 150 events emitted.')
      print('on', 'Listen for an event in the Choo emitter.')
      print('once', 'Listen for an event once in the Choo emitter.')
      print('state', 'Print the Choo state object.')
      print('storage', 'Print browser storage information.')
    }, 0)
    return 'Choo command overview'
  }
}

function print (cmd, desc) {
  var color = '#cc99cc'
  console.log('  %cchoo.' + cmd, 'color: ' + color, '— ' + desc)
}

function noop () {}

},{}],12:[function(require,module,exports){
var removeItems = require('remove-array-items')
var scheduler = require('nanoscheduler')()
var nanologger = require('nanologger')
var _log = nanologger('choo')
var clone = require('clone')

var MAX_HISTORY_LENGTH = 150   // How many items we should keep around

module.exports = log

function log (state, emitter, app, localEmitter) {
  var shouldDebug = window.localStorage.logLevel === 'debug'
  var history = []
  var i = 0
  var shouldWarn = true

  localEmitter.on('debug', function (bool) {
    shouldDebug = bool
  })

  window.choo._history = history
  window.choo.history = showHistory

  Object.defineProperty(window.choo, 'log', { get: showHistory, set: noop })
  Object.defineProperty(window.choo, 'history', { get: showHistory, set: noop })

  emitter.on('*', function (name, data) {
    i += 1
    var entry = new Event(name, data, state)
    history.push(entry)
    scheduler.push(function () {
      var length = history.length
      if (length > MAX_HISTORY_LENGTH) {
        removeItems(history, 0, length - MAX_HISTORY_LENGTH)
      }
    })
  })

  function showHistory () {
    setTimeout(function () {
      console.table(history)
    }, 0)
    var events = i === 1 ? 'event' : 'events'
    var msg = `${i} ${events} recorded, showing the last ${MAX_HISTORY_LENGTH}.`
    if (shouldDebug === false) {
      msg += ' Enable state capture by calling `choo.debug`.'
    } else {
      msg += ' Disable state capture by calling `choo.debug = false`.'
    }
    return msg
  }

  function Event (name, data, state) {
    this.name = name
    this.data = data === undefined ? '<no data>' : data
    this.state = shouldDebug
      ? tryClone(state)
      : '<disabled>'
  }

  function tryClone (state) {
    try {
      var _state = clone(state)
      if (!shouldWarn) shouldWarn = true
      return _state
    } catch (ex) {
      if (shouldWarn) {
        _log.warn('Could not clone your app state. Make sure to have a serializable state so it can be cloned')
        shouldWarn = false
      }
      return '<unserializable>'
    }
  }
}

function noop () {}

},{"clone":18,"nanologger":33,"nanoscheduler":40,"remove-array-items":48}],13:[function(require,module,exports){
var scheduler = require('nanoscheduler')()
var nanologger = require('nanologger')
var Hooks = require('choo-hooks')

module.exports = logger

function logger (state, emitter) {
  var initialRender = true
  var hooks = Hooks(emitter)
  var log = nanologger('choo')

  hooks.on('log:debug', logger('debug'))
  hooks.on('log:info', logger('info'))
  hooks.on('log:warn', logger('warn'))
  hooks.on('log:error', logger('error'))
  hooks.on('log:fatal', logger('fatal'))

  hooks.on('event', function (eventName, data, timing) {
    if (timing) {
      var duration = timing.duration.toFixed()
      var level = duration < 50 ? 'info' : 'warn'
      if (data !== undefined) logger(level)(eventName, data, duration + 'ms')
      else logger(level)(eventName, duration + 'ms')
    } else {
      if (data !== undefined) logger('info')(eventName, data)
      else logger('info')(eventName)
    }
  })

  hooks.on('use', function (count, duration) {
    logger('debug')('use', { count: count }, duration + 'ms')
  })

  hooks.on('unhandled', function (eventName, data) {
    logger('error')('No listeners for ' + eventName)
  })

  hooks.on('DOMContentLoaded', function (timing) {
    if (!timing) return logger('info')('DOMContentLoaded')
    var level = timing.interactive < 1000 ? 'info' : 'warn'
    logger(level)('DOMContentLoaded', timing.interactive + 'ms to interactive')
  })

  hooks.on('render', function (timings) {
    if (!timings || !timings.render) return logger('info')('render')
    var duration = timings.render.duration.toFixed()
    var msg = 'render'

    if (initialRender) {
      initialRender = false
      msg = 'initial ' + msg
    }

    // each frame has 10ms available for userland stuff
    var fps = Math.min((600 / duration).toFixed(), 60)

    if (fps === 60) {
      logger('info')(msg, fps + 'fps', duration + 'ms')
    } else {
      var times = {
        render: timings.render.duration.toFixed() + 'ms'
      }
      if (timings.morph) times.morph = timings.morph.duration.toFixed() + 'ms'
      logger('warn')(msg, fps + 'fps', duration + 'ms', times)
    }
  })

  hooks.on('resource-timing-buffer-full', function () {
    logger('error')("The browser's Resource Resource timing buffer is full. Cannot store any more timing information")
  })

  hooks.start()

  function logger (level) {
    return function () {
      var args = []
      for (var i = 0, len = arguments.length; i < len; i++) {
        args.push(arguments[i])
      }
      scheduler.push(function () {
        log[level].apply(log, args)
      })
    }
  }
}

},{"choo-hooks":15,"nanologger":33,"nanoscheduler":40}],14:[function(require,module,exports){
var pretty = require('prettier-bytes')

module.exports = storage

function storage () {
  Object.defineProperty(window.choo, 'storage', {
    get: get,
    set: noop
  })

  function get () {
    if (navigator.storage) {
      navigator.storage.estimate().then(function (estimate) {
        var value = (estimate.usage / estimate.quota).toFixed()
        clr('Max storage:', fmt(estimate.quota))
        clr('Storage used:', fmt(estimate.usage) + ' (' + value + '%)')
        navigator.storage.persisted().then(function (bool) {
          var val = bool ? 'enabled' : 'disabled'
          clr('Persistent storage:', val)
        })
      })
      return 'Calculating storage quota…'
    } else {
      var protocol = window.location.protocol
      return (/https/.test(protocol))
        ? "The Storage API is unavailable in this browser. We're sorry!"
        : 'The Storage API is unavailable. Serving this site over HTTPS might help enable it!'
    }
  }
}

function clr (msg, arg) {
  var color = '#cc99cc'
  console.log('%c' + msg, 'color: ' + color, arg)
}

function fmt (num) {
  return pretty(num).replace(' ', '')
}

function noop () {}

},{"prettier-bytes":46}],15:[function(require,module,exports){
var onPerformance = require('on-performance')
var scheduler = require('nanoscheduler')()
var assert = require('assert')

module.exports = ChooHooks

function ChooHooks (emitter) {
  if (!(this instanceof ChooHooks)) return new ChooHooks(emitter)

  assert.equal(typeof emitter, 'object')

  this.hasWindow = typeof window !== 'undefined'
  this.hasIdleCallback = this.hasWindow && window.requestIdleCallback
  this.hasPerformance = this.hasWindow &&
    window.performance &&
    window.performance.getEntriesByName

  this.emitter = emitter
  this.listeners = {}
  this.buffer = {
    use: [],
    render: {},
    events: {}
  }
}

ChooHooks.prototype.on = function (name, handler) {
  this.listeners[name] = handler
}

ChooHooks.prototype.start = function () {
  var self = this
  if (this.hasPerformance) {
    window.performance.onresourcetimingbufferfull = function () {
      var listener = self.listeners['resource-timing-buffer-full']
      if (listener) listener()
    }
  }

  // TODO also handle log events
  onPerformance(function (timing) {
    if (!timing) return
    if (timing.entryType !== 'measure') return

    var eventName = timing.name
    if (/choo\.morph/.test(eventName)) {
      self.buffer.render.morph = timing
    } else if (/choo\.route/.test(eventName)) {
      self.buffer.render.route = timing
    } else if (/choo\.render/.test(eventName)) {
      self.buffer.render.render = timing
    } else if (/choo\.use/.test(eventName)) {
      self.buffer.use.push(timing)
    } else if (/choo\.emit/.test(eventName) && !/log:/.test(eventName)) {
      var eventListener = self.listeners['event']
      if (eventListener) {
        var timingName = eventName.match(/choo\.emit\('(.*)'\)/)[1]
        if (timingName === 'render' || timingName === 'DOMContentLoaded') return

        var traceId = eventName.match(/\[(\d+)\]/)[1]
        var data = self.buffer.events[traceId]

        self.buffer.events[traceId] = null
        eventListener(timingName, data, timing)
      }
    }

    var rBuf = self.buffer.render
    if (rBuf.render && rBuf.route && rBuf.morph) {
      var renderListener = self.listeners['render']
      if (!renderListener) return
      var timings = {}
      while (self.buffer.render.length) {
        var _timing = self.buffer.render.pop()
        var name = _timing.name
        if (/choo\.render/.test(name)) timings.render = _timing
        else if (/choo\.morph/.test(name)) timings.morph = _timing
        else timings.route = _timing
      }
      rBuf.render = rBuf.route = rBuf.morph = void 0
      renderListener(timings)
    }
  })

  // Check if there's timings without any listeners
  // and trigger the DOMContentLoaded event.
  // If the timing API is not available, we handle all events here
  this.emitter.on('*', function (eventName, data, uuid) {
    var logLevel = /^log:(\w{4,5})/.exec(eventName)

    if (!self.hasPerformance && eventName === 'render') {
      // Render
      var renderListener = self.listeners['render']
      if (renderListener) renderListener()
    } else if (eventName === 'DOMContentLoaded') {
      // DOMContentLoaded
      self._emitLoaded()
    } else if (logLevel) {
      logLevel = logLevel[1]
      // Log:*
      var logListener = self.listeners['log:' + logLevel]
      if (logListener) logListener(eventName, data)
    } else if (!self.emitter.listeners(eventName).length) {
      // Unhandled
      var unhandledListener = self.listeners['unhandled']
      if (unhandledListener) unhandledListener(eventName, data)
    } else if (eventName !== 'render') {
      // *
      if (self.hasPerformance) self.buffer.events[uuid] = data
    }
  })
}

// compute and log time till interactive when DOMContentLoaded event fires
ChooHooks.prototype._emitLoaded = function () {
  var self = this
  scheduler.push(function clear () {
    var listener = self.listeners['DOMContentLoaded']
    var usesListener = self.listeners['use']

    var timing = self.hasWindow && window.performance && window.performance.timing

    if (listener && timing) {
      listener({
        interactive: timing.domInteractive - timing.navigationStart,
        loaded: timing.domContentLoadedEventEnd - timing.navigationStart
      })
    }

    if (self.hasPerformance) {
      var duration = sumDurations(self.buffer.use)
      if (usesListener) usesListener(self.buffer.use.length, duration)
    } else {
      usesListener()
    }
  })
}

function sumDurations (timings) {
  return timings.reduce(function (sum, timing) {
    return sum + timing.duration
  }, 0).toFixed()
}

},{"assert":1,"nanoscheduler":40,"on-performance":44}],16:[function(require,module,exports){
module.exports = require('bel')

},{"bel":3}],17:[function(require,module,exports){
var scrollToAnchor = require('scroll-to-anchor')
var documentReady = require('document-ready')
var nanolocation = require('nanolocation')
var nanotiming = require('nanotiming')
var nanorouter = require('nanorouter')
var nanomorph = require('nanomorph')
var nanoquery = require('nanoquery')
var nanohref = require('nanohref')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')
var xtend = require('xtend')

module.exports = Choo

var HISTORY_OBJECT = {}

function Choo (opts) {
  if (!(this instanceof Choo)) return new Choo(opts)
  opts = opts || {}

  assert.equal(typeof opts, 'object', 'choo: opts should be type object')

  var self = this

  // define events used by choo
  this._events = {
    DOMCONTENTLOADED: 'DOMContentLoaded',
    DOMTITLECHANGE: 'DOMTitleChange',
    REPLACESTATE: 'replaceState',
    PUSHSTATE: 'pushState',
    NAVIGATE: 'navigate',
    POPSTATE: 'popState',
    RENDER: 'render'
  }

  // properties for internal use only
  this._historyEnabled = opts.history === undefined ? true : opts.history
  this._hrefEnabled = opts.href === undefined ? true : opts.href
  this._hasWindow = typeof window !== 'undefined'
  this._createLocation = nanolocation
  this._loaded = false
  this._tree = null

  // properties that are part of the API
  this.router = nanorouter()
  this.emitter = nanobus('choo.emit')
  this.emit = this.emitter.emit.bind(this.emitter)

  var events = { events: this._events }
  if (this._hasWindow) {
    this.state = window.initialState
      ? xtend(window.initialState, events)
      : events
    delete window.initialState
  } else {
    this.state = events
  }

  // listen for title changes; available even when calling .toString()
  if (this._hasWindow) this.state.title = document.title
  this.emitter.prependListener(this._events.DOMTITLECHANGE, function (title) {
    assert.equal(typeof title, 'string', 'events.DOMTitleChange: title should be type string')
    self.state.title = title
    if (self._hasWindow) document.title = title
  })
}

Choo.prototype.route = function (route, handler) {
  assert.equal(typeof route, 'string', 'choo.route: route should be type string')
  assert.equal(typeof handler, 'function', 'choo.handler: route should be type function')
  this.router.on(route, handler)
}

Choo.prototype.use = function (cb) {
  assert.equal(typeof cb, 'function', 'choo.use: cb should be type function')
  var msg = 'choo.use'
  msg = cb.storeName ? msg + '(' + cb.storeName + ')' : msg
  var endTiming = nanotiming(msg)
  cb(this.state, this.emitter, this)
  endTiming()
}

Choo.prototype.start = function () {
  assert.equal(typeof window, 'object', 'choo.start: window was not found. .start() must be called in a browser, use .toString() if running in Node')

  var self = this
  if (this._historyEnabled) {
    this.emitter.prependListener(this._events.NAVIGATE, function () {
      self._matchRoute()
      if (self._loaded) {
        self.emitter.emit(self._events.RENDER)
        setTimeout(scrollToAnchor.bind(null, window.location.hash), 0)
      }
    })

    this.emitter.prependListener(this._events.POPSTATE, function () {
      self.emitter.emit(self._events.NAVIGATE)
    })

    this.emitter.prependListener(this._events.PUSHSTATE, function (href) {
      assert.equal(typeof href, 'string', 'events.pushState: href should be type string')
      window.history.pushState(HISTORY_OBJECT, null, href)
      self.emitter.emit(self._events.NAVIGATE)
    })

    this.emitter.prependListener(this._events.REPLACESTATE, function (href) {
      assert.equal(typeof href, 'string', 'events.replaceState: href should be type string')
      window.history.replaceState(HISTORY_OBJECT, null, href)
      self.emitter.emit(self._events.NAVIGATE)
    })

    window.onpopstate = function () {
      self.emitter.emit(self._events.POPSTATE)
    }

    if (self._hrefEnabled) {
      nanohref(function (location) {
        var href = location.href
        var currHref = window.location.href
        if (href === currHref) return
        self.emitter.emit(self._events.PUSHSTATE, href)
      })
    }
  }

  this._matchRoute()
  this._tree = this._prerender(this.state)
  assert.ok(this._tree, 'choo.start: no valid DOM node returned for location ' + this.state.href)

  this.emitter.prependListener(self._events.RENDER, nanoraf(function () {
    var renderTiming = nanotiming('choo.render')
    var newTree = self._prerender(self.state)
    assert.ok(newTree, 'choo.render: no valid DOM node returned for location ' + self.state.href)

    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.render: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    var morphTiming = nanotiming('choo.morph')
    nanomorph(self._tree, newTree)
    morphTiming()

    renderTiming()
  }))

  documentReady(function () {
    self.emitter.emit(self._events.DOMCONTENTLOADED)
    self._loaded = true
  })

  return this._tree
}

Choo.prototype.mount = function mount (selector) {
  if (typeof window !== 'object') {
    assert.ok(typeof selector === 'string', 'choo.mount: selector should be type String')
    this.selector = selector
    return this
  }

  assert.ok(typeof selector === 'string' || typeof selector === 'object', 'choo.mount: selector should be type String or HTMLElement')

  var self = this

  documentReady(function () {
    var renderTiming = nanotiming('choo.render')
    var newTree = self.start()
    if (typeof selector === 'string') {
      self._tree = document.querySelector(selector)
    } else {
      self._tree = selector
    }

    assert.ok(self._tree, 'choo.mount: could not query selector: ' + selector)
    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.mount: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    var morphTiming = nanotiming('choo.morph')
    nanomorph(self._tree, newTree)
    morphTiming()

    renderTiming()
  })
}

Choo.prototype.toString = function (location, state) {
  this.state = xtend(this.state, state || {})

  assert.notEqual(typeof window, 'object', 'choo.mount: window was found. .toString() must be called in Node, use .start() or .mount() if running in the browser')
  assert.equal(typeof location, 'string', 'choo.toString: location should be type string')
  assert.equal(typeof this.state, 'object', 'choo.toString: state should be type object')

  this._matchRoute(location)
  var html = this._prerender(this.state)
  assert.ok(html, 'choo.toString: no valid value returned for the route ' + location)
  return html.toString()
}

Choo.prototype._matchRoute = function (locationOverride) {
  var location, queryString
  if (locationOverride) {
    location = locationOverride.replace(/\?.+$/, '')
    queryString = locationOverride
  } else {
    location = this._createLocation()
    queryString = window.location.search
  }
  var matched = this.router.match(location)
  this.state.href = location
  this.state.query = nanoquery(queryString)
  this.state.route = matched.route
  this.state.params = matched.params
  this.state._handler = matched.cb
  return this.state
}

Choo.prototype._prerender = function (state) {
  var routeTiming = nanotiming("choo.prerender('" + state.route + "')")
  var res = state._handler(state, this.emit)
  routeTiming()
  return res
}

},{"assert":1,"document-ready":20,"nanobus":29,"nanohref":31,"nanolocation":32,"nanomorph":34,"nanoquery":37,"nanoraf":38,"nanorouter":39,"nanotiming":41,"scroll-to-anchor":49,"xtend":58}],18:[function(require,module,exports){
(function (Buffer){
var clone = (function() {
'use strict';

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function(value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function(value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}

}).call(this,require("buffer").Buffer)
},{"buffer":6}],19:[function(require,module,exports){
'use strict';
module.exports = input => {
	const el = document.createElement('textarea');

	el.value = input;

	// Prevent keyboard from showing on mobile
	el.setAttribute('readonly', '');

	el.style.contain = 'strict';
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	el.style.fontSize = '12pt'; // Prevent zooming on iOS

	const selection = document.getSelection();
	let originalRange = false;
	if (selection.rangeCount > 0) {
		originalRange = selection.getRangeAt(0);
	}

	document.body.appendChild(el);
	el.select();

	// Explicit selection workaround for iOS
	el.selectionStart = 0;
	el.selectionEnd = input.length;

	let success = false;
	try {
		success = document.execCommand('copy');
	} catch (err) {}

	document.body.removeChild(el);

	if (originalRange) {
		selection.removeAllRanges();
		selection.addRange(originalRange);
	}

	return success;
};

},{}],20:[function(require,module,exports){
'use strict'

var assert = require('assert')

module.exports = ready

function ready (callback) {
  assert.notEqual(typeof document, 'undefined', 'document-ready only runs in the browser')
  var state = document.readyState
  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', function onLoad () {
    callback()
  })
}

},{"assert":1}],21:[function(require,module,exports){
module.exports = stringify
stringify.default = stringify
function stringify (obj) {
  decirc(obj, '', [], null)
  return JSON.stringify(obj)
}
function Circle (val, k, parent) {
  this.val = val
  this.k = k
  this.parent = parent
  this.count = 1
}
Circle.prototype.toJSON = function toJSON () {
  if (--this.count === 0) {
    this.parent[this.k] = this.val
  }
  return '[Circular]'
}
function decirc (val, k, stack, parent) {
  if (typeof val === 'object' && val !== null) {
    if (typeof val.toJSON === 'function') {
      if (val instanceof Circle) {
        val.count++
        return
      }
      if (val.toJSON.forceDecirc === undefined) {
        return
      }
    }
    for (var i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        parent[k] = new Circle(val, k, parent)
        return
      }
    }
    stack.push(val)
    for (var key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        decirc(val[key], key, stack, val)
      }
    }
    stack.pop()
  }
}

},{}],22:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":4}],23:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],25:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        p.push([ VAR, xstate, arg ])
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          res.push([OPEN, reg])
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":24}],26:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],27:[function(require,module,exports){
var containers = []; // will store container HTMLElement references
var styleElements = []; // will store {prepend: HTMLElement, append: HTMLElement}

var usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';

function insertCss(css, options) {
    options = options || {};

    if (css === undefined) {
        throw new Error(usage);
    }

    var position = options.prepend === true ? 'prepend' : 'append';
    var container = options.container !== undefined ? options.container : document.querySelector('head');
    var containerId = containers.indexOf(container);

    // first time we see this container, create the necessary entries
    if (containerId === -1) {
        containerId = containers.push(container) - 1;
        styleElements[containerId] = {};
    }

    // try to get the correponding container + position styleElement, create it otherwise
    var styleElement;

    if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
        styleElement = styleElements[containerId][position];
    } else {
        styleElement = styleElements[containerId][position] = createStyleElement();

        if (position === 'prepend') {
            container.insertBefore(styleElement, container.childNodes[0]);
        } else {
            container.appendChild(styleElement);
        }
    }

    // strip potential UTF-8 BOM if css was read from a file
    if (css.charCodeAt(0) === 0xFEFF) { css = css.substr(1, css.length); }

    // actually add the stylesheet
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText += css
    } else {
        styleElement.textContent += css;
    }

    return styleElement;
};

function createStyleElement() {
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    return styleElement;
}

module.exports = insertCss;
module.exports.insertCss = insertCss;

},{}],28:[function(require,module,exports){
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],29:[function(require,module,exports){
var splice = require('remove-array-items')
var nanotiming = require('nanotiming')
var assert = require('assert')

module.exports = Nanobus

function Nanobus (name) {
  if (!(this instanceof Nanobus)) return new Nanobus(name)

  this._name = name || 'nanobus'
  this._starListeners = []
  this._listeners = {}
}

Nanobus.prototype.emit = function (eventName) {
  assert.equal(typeof eventName, 'string', 'nanobus.emit: eventName should be type string')

  var data = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    data.push(arguments[i])
  }

  var emitTiming = nanotiming(this._name + "('" + eventName + "')")
  var listeners = this._listeners[eventName]
  if (listeners && listeners.length > 0) {
    this._emit(this._listeners[eventName], data)
  }

  if (this._starListeners.length > 0) {
    this._emit(this._starListeners, eventName, data, emitTiming.uuid)
  }
  emitTiming()

  return this
}

Nanobus.prototype.on = Nanobus.prototype.addListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.on: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.on: listener should be type function')

  if (eventName === '*') {
    this._starListeners.push(listener)
  } else {
    if (!this._listeners[eventName]) this._listeners[eventName] = []
    this._listeners[eventName].push(listener)
  }
  return this
}

Nanobus.prototype.prependListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.prependListener: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.prependListener: listener should be type function')

  if (eventName === '*') {
    this._starListeners.unshift(listener)
  } else {
    if (!this._listeners[eventName]) this._listeners[eventName] = []
    this._listeners[eventName].unshift(listener)
  }
  return this
}

Nanobus.prototype.once = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.once: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.once: listener should be type function')

  var self = this
  this.on(eventName, once)
  function once () {
    listener.apply(self, arguments)
    self.removeListener(eventName, once)
  }
  return this
}

Nanobus.prototype.prependOnceListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.prependOnceListener: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.prependOnceListener: listener should be type function')

  var self = this
  this.prependListener(eventName, once)
  function once () {
    listener.apply(self, arguments)
    self.removeListener(eventName, once)
  }
  return this
}

Nanobus.prototype.removeListener = function (eventName, listener) {
  assert.equal(typeof eventName, 'string', 'nanobus.removeListener: eventName should be type string')
  assert.equal(typeof listener, 'function', 'nanobus.removeListener: listener should be type function')

  if (eventName === '*') {
    this._starListeners = this._starListeners.slice()
    return remove(this._starListeners, listener)
  } else {
    if (typeof this._listeners[eventName] !== 'undefined') {
      this._listeners[eventName] = this._listeners[eventName].slice()
    }

    return remove(this._listeners[eventName], listener)
  }

  function remove (arr, listener) {
    if (!arr) return
    var index = arr.indexOf(listener)
    if (index !== -1) {
      splice(arr, index, 1)
      return true
    }
  }
}

Nanobus.prototype.removeAllListeners = function (eventName) {
  if (eventName) {
    if (eventName === '*') {
      this._starListeners = []
    } else {
      this._listeners[eventName] = []
    }
  } else {
    this._starListeners = []
    this._listeners = {}
  }
  return this
}

Nanobus.prototype.listeners = function (eventName) {
  var listeners = eventName !== '*'
    ? this._listeners[eventName]
    : this._starListeners

  var ret = []
  if (listeners) {
    var ilength = listeners.length
    for (var i = 0; i < ilength; i++) ret.push(listeners[i])
  }
  return ret
}

Nanobus.prototype._emit = function (arr, eventName, data, uuid) {
  if (typeof arr === 'undefined') return
  if (arr.length === 0) return
  if (data === undefined) {
    data = eventName
    eventName = null
  }

  if (eventName) {
    if (uuid !== undefined) {
      data = [eventName].concat(data, uuid)
    } else {
      data = [eventName].concat(data)
    }
  }

  var length = arr.length
  for (var i = 0; i < length; i++) {
    var listener = arr[i]
    listener.apply(listener, data)
  }
}

},{"assert":1,"nanotiming":41,"remove-array-items":48}],30:[function(require,module,exports){
var document = require('global/document')
var nanotiming = require('nanotiming')
var morph = require('nanomorph')
var onload = require('on-load')
var OL_KEY_ID = onload.KEY_ID
var OL_ATTR_ID = onload.KEY_ATTR
var assert = require('assert')

module.exports = Nanocomponent

function makeID () {
  return 'ncid-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}

function Nanocomponent (name) {
  this._hasWindow = typeof window !== 'undefined'
  this._id = null // represents the id of the root node
  this._ncID = null // internal nanocomponent id
  this._olID = null
  this._proxy = null
  this._loaded = false // Used to debounce on-load when child-reordering
  this._rootNodeName = null
  this._name = name || 'nanocomponent'
  this._rerender = false

  this._handleLoad = this._handleLoad.bind(this)
  this._handleUnload = this._handleUnload.bind(this)

  this._arguments = []

  var self = this

  Object.defineProperty(this, 'element', {
    get: function () {
      var el = document.getElementById(self._id)
      if (el) return el.dataset.nanocomponent === self._ncID ? el : undefined
    }
  })
}

Nanocomponent.prototype.render = function () {
  var renderTiming = nanotiming(this._name + '.render')
  var self = this
  var args = new Array(arguments.length)
  var el
  for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]
  if (!this._hasWindow) {
    var createTiming = nanotiming(this._name + '.create')
    el = this.createElement.apply(this, args)
    createTiming()
    renderTiming()
    return el
  } else if (this.element) {
    el = this.element  // retain reference, as the ID might change on render
    var updateTiming = nanotiming(this._name + '.update')
    var shouldUpdate = this._rerender || this.update.apply(this, args)
    updateTiming()
    if (this._rerender) this._rerender = false
    if (shouldUpdate) {
      var desiredHtml = this._handleRender(args)
      var morphTiming = nanotiming(this._name + '.morph')
      morph(el, desiredHtml)
      morphTiming()
      if (this.afterupdate) this.afterupdate(el)
    }
    if (!this._proxy) { this._proxy = this._createProxy() }
    renderTiming()
    return this._proxy
  } else {
    this._reset()
    el = this._handleRender(args)
    if (this.beforerender) this.beforerender(el)
    if (this.load || this.unload || this.afterreorder) {
      onload(el, self._handleLoad, self._handleUnload, self._ncID)
      this._olID = el.dataset[OL_KEY_ID]
    }
    renderTiming()
    return el
  }
}

Nanocomponent.prototype.rerender = function () {
  assert(this.element, 'nanocomponent: cant rerender on an unmounted dom node')
  this._rerender = true
  this.render.apply(this, this._arguments)
}

Nanocomponent.prototype._handleRender = function (args) {
  var createElementTiming = nanotiming(this._name + '.createElement')
  var el = this.createElement.apply(this, args)
  createElementTiming()
  if (!this._rootNodeName) this._rootNodeName = el.nodeName
  assert(el instanceof window.HTMLElement, 'nanocomponent: createElement should return a DOM node')
  assert.equal(this._rootNodeName, el.nodeName, 'nanocomponent: root node types cannot differ between re-renders')
  this._arguments = args
  return this._brandNode(this._ensureID(el))
}

Nanocomponent.prototype._createProxy = function () {
  var proxy = document.createElement(this._rootNodeName)
  var self = this
  this._brandNode(proxy)
  proxy.id = this._id
  proxy.setAttribute('data-proxy', '')
  proxy.isSameNode = function (el) {
    return (el && el.dataset.nanocomponent === self._ncID)
  }
  return proxy
}

Nanocomponent.prototype._reset = function () {
  this._ncID = makeID()
  this._olID = null
  this._id = null
  this._proxy = null
  this._rootNodeName = null
}

Nanocomponent.prototype._brandNode = function (node) {
  node.setAttribute('data-nanocomponent', this._ncID)
  if (this._olID) node.setAttribute(OL_ATTR_ID, this._olID)
  return node
}

Nanocomponent.prototype._ensureID = function (node) {
  if (node.id) this._id = node.id
  else node.id = this._id = this._ncID
  // Update proxy node ID if it changed
  if (this._proxy && this._proxy.id !== this._id) this._proxy.id = this._id
  return node
}

Nanocomponent.prototype._handleLoad = function (el) {
  if (this._loaded) {
    if (this.afterreorder) this.afterreorder(el)
    return // Debounce child-reorders
  }
  this._loaded = true
  if (this.load) this.load(el)
}

Nanocomponent.prototype._handleUnload = function (el) {
  if (this.element) return // Debounce child-reorders
  this._loaded = false
  if (this.unload) this.unload(el)
}

Nanocomponent.prototype.createElement = function () {
  throw new Error('nanocomponent: createElement should be implemented!')
}

Nanocomponent.prototype.update = function () {
  throw new Error('nanocomponent: update should be implemented!')
}

},{"assert":28,"global/document":22,"nanomorph":34,"nanotiming":41,"on-load":43}],31:[function(require,module,exports){
var assert = require('assert')

var safeExternalLink = /(noopener|noreferrer) (noopener|noreferrer)/
var protocolLink = /^[\w-_]+:/

module.exports = href

function href (cb, root) {
  assert.notEqual(typeof window, 'undefined', 'nanohref: expected window to exist')

  root = root || window.document

  assert.equal(typeof cb, 'function', 'nanohref: cb should be type function')
  assert.equal(typeof root, 'object', 'nanohref: root should be type object')

  window.addEventListener('click', function (e) {
    if ((e.button && e.button !== 0) ||
      e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ||
      e.defaultPrevented) return

    var anchor = (function traverse (node) {
      if (!node || node === root) return
      if (node.localName !== 'a' || node.href === undefined) {
        return traverse(node.parentNode)
      }
      return node
    })(e.target)

    if (!anchor) return

    if (window.location.origin !== anchor.origin ||
      anchor.hasAttribute('download') ||
      (anchor.getAttribute('target') === '_blank' &&
        safeExternalLink.test(anchor.getAttribute('rel'))) ||
      protocolLink.test(anchor.getAttribute('href'))) return

    e.preventDefault()
    cb(anchor)
  })
}

},{"assert":1}],32:[function(require,module,exports){
var assert = require('assert')

module.exports = nanolocation

function nanolocation () {
  assert.notEqual(typeof window, 'undefined', 'nanolocation: expected window to exist')
  var pathname = window.location.pathname.replace(/\/$/, '')
  var hash = window.location.hash.replace(/^#/, '/')
  return pathname + hash
}

},{"assert":1}],33:[function(require,module,exports){
var assert = require('assert')
var xtend = require('xtend')

var emojis = {
  trace: '🔍',
  debug: '🐛',
  info: '✨',
  warn: '⚠️',
  error: '🚨',
  fatal: '💀'
}

var levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
}

var defaultColors = {
  foreground: '#d3c0c8',
  background: '#2d2d2d',
  black: '#2d2d2d',
  red: '#f2777a',
  green: '#99cc99',
  yellow: '#ffcc66',
  blue: '#6699cc',
  magenta: '#cc99cc',
  cyan: '#66cccc',
  white: '#d3d0c8',
  brightBlack: '#747369'
}

module.exports = Nanologger

function Nanologger (name, opts) {
  opts = opts || {}
  if (!(this instanceof Nanologger)) return new Nanologger(name, opts)

  assert.equal(typeof opts, 'object', 'nanologger: opts should be type object')

  this._name = name || ''
  this._colors = xtend(defaultColors, opts.colors || {})

  try {
    this.logLevel = window.localStorage.getItem('logLevel') || 'info'
  } catch (e) {
    this.logLevel = 'info'
  }

  this._logLevel = levels[this.logLevel]
}

Nanologger.prototype.trace = function () {
  var args = [ 'trace' ]
  for (var i = 0, len = arguments.length; i < len; i++) args.push(arguments[i])
  this._print.apply(this, args)
}

Nanologger.prototype.debug = function () {
  var args = [ 'debug' ]
  for (var i = 0, len = arguments.length; i < len; i++) args.push(arguments[i])
  this._print.apply(this, args)
}

Nanologger.prototype.info = function () {
  var args = [ 'info' ]
  for (var i = 0, len = arguments.length; i < len; i++) args.push(arguments[i])
  this._print.apply(this, args)
}

Nanologger.prototype.warn = function () {
  var args = [ 'warn' ]
  for (var i = 0, len = arguments.length; i < len; i++) args.push(arguments[i])
  this._print.apply(this, args)
}

Nanologger.prototype.error = function () {
  var args = [ 'error' ]
  for (var i = 0, len = arguments.length; i < len; i++) args.push(arguments[i])
  this._print.apply(this, args)
}

Nanologger.prototype.fatal = function () {
  var args = [ 'fatal' ]
  for (var i = 0, len = arguments.length; i < len; i++) args.push(arguments[i])
  this._print.apply(this, args)
}

Nanologger.prototype._print = function (level) {
  if (levels[level] < this._logLevel) return

  var time = getTimeStamp()
  var emoji = emojis[level]
  var name = this._name || 'unknown'

  var msgColor = (level === 'error' || level.fatal)
    ? this._colors.red
    : level === 'warn'
      ? this._colors.yellow
      : this._colors.green

  var objs = []
  var args = [ null ]
  var msg = '%c%s ' + emoji + ' %c%s'

  args.push(color(this._colors.brightBlack), time)
  args.push(color(this._colors.magenta), name)

  for (var i = 1, len = arguments.length; i < len; i++) {
    var arg = arguments[i]
    if (typeof arg === 'string') {
      if (i === 1) {
        // first string argument is in color
        msg += ' %c%s'
        args.push(color(msgColor))
        args.push(arg)
      } else if (/ms$/.test(arg)) {
        // arguments finishing with 'ms', grey out
        msg += ' %c%s'
        args.push(color(this._colors.brightBlack))
        args.push(arg)
      } else {
        // normal colors
        msg += ' %c%s'
        args.push(color(this._colors.white))
        args.push(arg)
      }
    } else if (typeof arg === 'number') {
      msg += ' %c%d'
      args.push(color(this._colors.magenta))
      args.push(arg)
    } else {
      objs.push(arg)
    }
  }

  args[0] = msg
  objs.forEach(function (obj) {
    args.push(obj)
  })

  // In IE/Edge console functions don't inherit from Function.prototype
  // so this is necessary to get all the args applied.
  Function.prototype.apply.apply(console.log, [console, args])
}

function color (color) {
  return 'color: ' + color + ';'
}

function getTimeStamp () {
  var date = new Date()
  var hours = pad(date.getHours().toString())
  var minutes = pad(date.getMinutes().toString())
  var seconds = pad(date.getSeconds().toString())
  return hours + ':' + minutes + ':' + seconds
}

function pad (str) {
  return str.length !== 2 ? 0 + str : str
}

},{"assert":1,"xtend":58}],34:[function(require,module,exports){
var assert = require('assert')
var morph = require('./lib/morph')

var TEXT_NODE = 3
// var DEBUG = false

module.exports = nanomorph

// Morph one tree into another tree
//
// no parent
//   -> same: diff and walk children
//   -> not same: replace and return
// old node doesn't exist
//   -> insert new node
// new node doesn't exist
//   -> delete old node
// nodes are not the same
//   -> diff nodes and apply patch to old node
// nodes are the same
//   -> walk all child nodes and append to old node
function nanomorph (oldTree, newTree) {
  // if (DEBUG) {
  //   console.log(
  //   'nanomorph\nold\n  %s\nnew\n  %s',
  //   oldTree && oldTree.outerHTML,
  //   newTree && newTree.outerHTML
  // )
  // }
  assert.equal(typeof oldTree, 'object', 'nanomorph: oldTree should be an object')
  assert.equal(typeof newTree, 'object', 'nanomorph: newTree should be an object')
  var tree = walk(newTree, oldTree)
  // if (DEBUG) console.log('=> morphed\n  %s', tree.outerHTML)
  return tree
}

// Walk and morph a dom tree
function walk (newNode, oldNode) {
  // if (DEBUG) {
  //   console.log(
  //   'walk\nold\n  %s\nnew\n  %s',
  //   oldNode && oldNode.outerHTML,
  //   newNode && newNode.outerHTML
  // )
  // }
  if (!oldNode) {
    return newNode
  } else if (!newNode) {
    return null
  } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
    return oldNode
  } else if (newNode.tagName !== oldNode.tagName) {
    return newNode
  } else {
    morph(newNode, oldNode)
    updateChildren(newNode, oldNode)
    return oldNode
  }
}

// Update the children of elements
// (obj, obj) -> null
function updateChildren (newNode, oldNode) {
  // if (DEBUG) {
  //   console.log(
  //   'updateChildren\nold\n  %s\nnew\n  %s',
  //   oldNode && oldNode.outerHTML,
  //   newNode && newNode.outerHTML
  // )
  // }
  var oldChild, newChild, morphed, oldMatch

  // The offset is only ever increased, and used for [i - offset] in the loop
  var offset = 0

  for (var i = 0; ; i++) {
    oldChild = oldNode.childNodes[i]
    newChild = newNode.childNodes[i - offset]
    // if (DEBUG) {
    //   console.log(
    //   '===\n- old\n  %s\n- new\n  %s',
    //   oldChild && oldChild.outerHTML,
    //   newChild && newChild.outerHTML
    // )
    // }
    // Both nodes are empty, do nothing
    if (!oldChild && !newChild) {
      break

    // There is no new child, remove old
    } else if (!newChild) {
      oldNode.removeChild(oldChild)
      i--

    // There is no old child, add new
    } else if (!oldChild) {
      oldNode.appendChild(newChild)
      offset++

    // Both nodes are the same, morph
    } else if (same(newChild, oldChild)) {
      morphed = walk(newChild, oldChild)
      if (morphed !== oldChild) {
        oldNode.replaceChild(morphed, oldChild)
        offset++
      }

    // Both nodes do not share an ID or a placeholder, try reorder
    } else {
      oldMatch = null

      // Try and find a similar node somewhere in the tree
      for (var j = i; j < oldNode.childNodes.length; j++) {
        if (same(oldNode.childNodes[j], newChild)) {
          oldMatch = oldNode.childNodes[j]
          break
        }
      }

      // If there was a node with the same ID or placeholder in the old list
      if (oldMatch) {
        morphed = walk(newChild, oldMatch)
        if (morphed !== oldMatch) offset++
        oldNode.insertBefore(morphed, oldChild)

      // It's safe to morph two nodes in-place if neither has an ID
      } else if (!newChild.id && !oldChild.id) {
        morphed = walk(newChild, oldChild)
        if (morphed !== oldChild) {
          oldNode.replaceChild(morphed, oldChild)
          offset++
        }

      // Insert the node at the index if we couldn't morph or find a matching node
      } else {
        oldNode.insertBefore(newChild, oldChild)
        offset++
      }
    }
  }
}

function same (a, b) {
  if (a.id) return a.id === b.id
  if (a.isSameNode) return a.isSameNode(b)
  if (a.tagName !== b.tagName) return false
  if (a.type === TEXT_NODE) return a.nodeValue === b.nodeValue
  return false
}

},{"./lib/morph":36,"assert":28}],35:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'onmouseenter',
  'onmouseleave',
  'ontouchcancel',
  'ontouchend',
  'ontouchmove',
  'ontouchstart',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}],36:[function(require,module,exports){
var events = require('./events')
var eventsLength = events.length

var ELEMENT_NODE = 1
var TEXT_NODE = 3
var COMMENT_NODE = 8

module.exports = morph

// diff elements and apply the resulting patch to the old node
// (obj, obj) -> null
function morph (newNode, oldNode) {
  var nodeType = newNode.nodeType
  var nodeName = newNode.nodeName

  if (nodeType === ELEMENT_NODE) {
    copyAttrs(newNode, oldNode)
  }

  if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue
    }
  }

  // Some DOM nodes are weird
  // https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
  if (nodeName === 'INPUT') updateInput(newNode, oldNode)
  else if (nodeName === 'OPTION') updateOption(newNode, oldNode)
  else if (nodeName === 'TEXTAREA') updateTextarea(newNode, oldNode)

  copyEvents(newNode, oldNode)
}

function copyAttrs (newNode, oldNode) {
  var oldAttrs = oldNode.attributes
  var newAttrs = newNode.attributes
  var attrNamespaceURI = null
  var attrValue = null
  var fromValue = null
  var attrName = null
  var attr = null

  for (var i = newAttrs.length - 1; i >= 0; --i) {
    attr = newAttrs[i]
    attrName = attr.name
    attrNamespaceURI = attr.namespaceURI
    attrValue = attr.value
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName
      fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName)
      if (fromValue !== attrValue) {
        oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue)
      }
    } else {
      if (!oldNode.hasAttribute(attrName)) {
        oldNode.setAttribute(attrName, attrValue)
      } else {
        fromValue = oldNode.getAttribute(attrName)
        if (fromValue !== attrValue) {
          // apparently values are always cast to strings, ah well
          if (attrValue === 'null' || attrValue === 'undefined') {
            oldNode.removeAttribute(attrName)
          } else {
            oldNode.setAttribute(attrName, attrValue)
          }
        }
      }
    }
  }

  // Remove any extra attributes found on the original DOM element that
  // weren't found on the target element.
  for (var j = oldAttrs.length - 1; j >= 0; --j) {
    attr = oldAttrs[j]
    if (attr.specified !== false) {
      attrName = attr.name
      attrNamespaceURI = attr.namespaceURI

      if (attrNamespaceURI) {
        attrName = attr.localName || attrName
        if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          oldNode.removeAttributeNS(attrNamespaceURI, attrName)
        }
      } else {
        if (!newNode.hasAttributeNS(null, attrName)) {
          oldNode.removeAttribute(attrName)
        }
      }
    }
  }
}

function copyEvents (newNode, oldNode) {
  for (var i = 0; i < eventsLength; i++) {
    var ev = events[i]
    if (newNode[ev]) {           // if new element has a whitelisted attribute
      oldNode[ev] = newNode[ev]  // update existing element
    } else if (oldNode[ev]) {    // if existing element has it and new one doesnt
      oldNode[ev] = undefined    // remove it from existing element
    }
  }
}

function updateOption (newNode, oldNode) {
  updateAttribute(newNode, oldNode, 'selected')
}

// The "value" attribute is special for the <input> element since it sets the
// initial value. Changing the "value" attribute without changing the "value"
// property will have no effect since it is only used to the set the initial
// value. Similar for the "checked" attribute, and "disabled".
function updateInput (newNode, oldNode) {
  var newValue = newNode.value
  var oldValue = oldNode.value

  updateAttribute(newNode, oldNode, 'checked')
  updateAttribute(newNode, oldNode, 'disabled')

  if (newValue !== oldValue) {
    oldNode.setAttribute('value', newValue)
    oldNode.value = newValue
  }

  if (newValue === 'null') {
    oldNode.value = ''
    oldNode.removeAttribute('value')
  }

  if (!newNode.hasAttributeNS(null, 'value')) {
    oldNode.removeAttribute('value')
  } else if (oldNode.type === 'range') {
    // this is so elements like slider move their UI thingy
    oldNode.value = newValue
  }
}

function updateTextarea (newNode, oldNode) {
  var newValue = newNode.value
  if (newValue !== oldNode.value) {
    oldNode.value = newValue
  }

  if (oldNode.firstChild && oldNode.firstChild.nodeValue !== newValue) {
    // Needed for IE. Apparently IE sets the placeholder as the
    // node value and vise versa. This ignores an empty update.
    if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) {
      return
    }

    oldNode.firstChild.nodeValue = newValue
  }
}

function updateAttribute (newNode, oldNode, name) {
  if (newNode[name] !== oldNode[name]) {
    oldNode[name] = newNode[name]
    if (newNode[name]) {
      oldNode.setAttribute(name, '')
    } else {
      oldNode.removeAttribute(name)
    }
  }
}

},{"./events":35}],37:[function(require,module,exports){
var reg = /([^?=&]+)(=([^&]*))?/g
var assert = require('assert')

module.exports = qs

function qs (url) {
  assert.equal(typeof url, 'string', 'nanoquery: url should be type string')

  var obj = {}
  url.replace(/^.*\?/, '').replace(reg, function (a0, a1, a2, a3) {
    obj[decodeURIComponent(a1)] = decodeURIComponent(a3)
  })

  return obj
}

},{"assert":28}],38:[function(require,module,exports){
'use strict'

var assert = require('assert')

module.exports = nanoraf

// Only call RAF when needed
// (fn, fn?) -> fn
function nanoraf (render, raf) {
  assert.equal(typeof render, 'function', 'nanoraf: render should be a function')
  assert.ok(typeof raf === 'function' || typeof raf === 'undefined', 'nanoraf: raf should be a function or undefined')

  if (!raf) raf = window.requestAnimationFrame
  var redrawScheduled = false
  var args = null

  return function frame () {
    if (args === null && !redrawScheduled) {
      redrawScheduled = true

      raf(function redraw () {
        redrawScheduled = false

        var length = args.length
        var _args = new Array(length)
        for (var i = 0; i < length; i++) _args[i] = args[i]

        render.apply(render, _args)
        args = null
      })
    }

    args = arguments
  }
}

},{"assert":1}],39:[function(require,module,exports){
var assert = require('assert')
var wayfarer = require('wayfarer')

// electron support
var isLocalFile = (/file:\/\//.test(
  typeof window === 'object' &&
  window.location &&
  window.location.origin
))

/* eslint-disable no-useless-escape */
var electron = '^(file:\/\/|\/)(.*\.html?\/?)?'
var protocol = '^(http(s)?(:\/\/))?(www\.)?'
var domain = '[a-zA-Z0-9-_\.]+(:[0-9]{1,5})?(\/{1})?'
var qs = '[\?].*$'
/* eslint-enable no-useless-escape */

var stripElectron = new RegExp(electron)
var prefix = new RegExp(protocol + domain)
var normalize = new RegExp('#')
var suffix = new RegExp(qs)

module.exports = Nanorouter

function Nanorouter (opts) {
  if (!(this instanceof Nanorouter)) return new Nanorouter(opts)
  opts = opts || {}
  this.router = wayfarer(opts.default || '/404')
}

Nanorouter.prototype.on = function (routename, listener) {
  assert.equal(typeof routename, 'string')
  routename = routename.replace(/^[#/]/, '')
  this.router.on(routename, listener)
}

Nanorouter.prototype.emit = function (routename) {
  assert.equal(typeof routename, 'string')
  routename = pathname(routename, isLocalFile)
  return this.router.emit(routename)
}

Nanorouter.prototype.match = function (routename) {
  assert.equal(typeof routename, 'string')
  routename = pathname(routename, isLocalFile)
  return this.router.match(routename)
}

// replace everything in a route but the pathname and hash
function pathname (routename, isElectron) {
  if (isElectron) routename = routename.replace(stripElectron, '')
  else routename = routename.replace(prefix, '')
  return routename.replace(suffix, '').replace(normalize, '/')
}

},{"assert":1,"wayfarer":56}],40:[function(require,module,exports){
var assert = require('assert')

var hasWindow = typeof window !== 'undefined'

function createScheduler () {
  var scheduler
  if (hasWindow) {
    if (!window._nanoScheduler) window._nanoScheduler = new NanoScheduler(true)
    scheduler = window._nanoScheduler
  } else {
    scheduler = new NanoScheduler()
  }
  return scheduler
}

function NanoScheduler (hasWindow) {
  this.hasWindow = hasWindow
  this.hasIdle = this.hasWindow && window.requestIdleCallback
  this.method = this.hasIdle ? window.requestIdleCallback.bind(window) : this.setTimeout
  this.scheduled = false
  this.queue = []
}

NanoScheduler.prototype.push = function (cb) {
  assert.equal(typeof cb, 'function', 'nanoscheduler.push: cb should be type function')
  if (!this.hasWindow) return

  this.queue.push(cb)
  this.schedule()
}

NanoScheduler.prototype.schedule = function () {
  if (this.scheduled) return

  this.scheduled = true
  var self = this
  this.method(function (idleDeadline) {
    var cb
    while (self.queue.length && idleDeadline.timeRemaining() > 0) {
      cb = self.queue.shift()
      cb(idleDeadline)
    }
    self.scheduled = false
    if (self.queue.length) self.schedule()
  })
}

NanoScheduler.prototype.setTimeout = function (cb) {
  setTimeout(cb, 0, {
    timeRemaining: function () {
      return 1
    }
  })
}

module.exports = createScheduler

},{"assert":28}],41:[function(require,module,exports){
var scheduler = require('nanoscheduler')()
var assert = require('assert')

var perf
nanotiming.disabled = true
try {
  perf = window.performance
  nanotiming.disabled = window.localStorage.DISABLE_NANOTIMING === 'true' || !perf.mark
} catch (e) { }

module.exports = nanotiming

function nanotiming (name) {
  assert.equal(typeof name, 'string', 'nanotiming: name should be type string')

  if (nanotiming.disabled) return noop

  var uuid = (perf.now() * 10000).toFixed() % Number.MAX_SAFE_INTEGER
  var startName = 'start-' + uuid + '-' + name
  perf.mark(startName)

  function end (cb) {
    var endName = 'end-' + uuid + '-' + name
    perf.mark(endName)

    scheduler.push(function () {
      var err = null
      try {
        var measureName = name + ' [' + uuid + ']'
        perf.measure(measureName, startName, endName)
        perf.clearMarks(startName)
        perf.clearMarks(endName)
      } catch (e) { err = e }
      if (cb) cb(err, name)
    })
  }

  end.uuid = uuid
  return end
}

function noop (cb) {
  if (cb) {
    scheduler.push(function () {
      cb(new Error('nanotiming: performance API unavailable'))
    })
  }
}

},{"assert":1,"nanoscheduler":40}],42:[function(require,module,exports){
var assert = require('assert')

module.exports = objectChangeCallsite

function objectChangeCallsite (target, callback) {
  assert.equal(typeof target, 'object', 'object-change-callsite: target should be type object')
  assert.equal(typeof callback, 'function', 'object-change-callsite: callback should be type function')

  return new Proxy(target, {
    set: function (obj, prop, value) {
      var err = new Error()
      var trace = strip(err.stack)
      callback(prop, value, trace)
      obj[prop] = value
      return true
    },
    deleteProperty: function (target, prop) {
      var err = new Error()
      var trace = strip(err.stack)
      callback(prop, undefined, trace)
      if (prop in target) {
        delete target[prop]
        return true
      }
      return false
    }
  })
}

function strip (str) {
  var arr = str.split('\n')
  arr = arr.length > 2 ? arr.slice(2) : arr
  arr[0] = arr[0].replace(/^ {4}at /, '')
  return '\n' + arr.join('\n')
}

},{"assert":1}],43:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var assert = require('assert')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  if (document.body) {
    beginObserve(observer)
  } else {
    document.addEventListener('DOMContentLoaded', function (event) {
      beginObserve(observer)
    })
  }
}

function beginObserve (observer) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  assert(document.body, 'on-load: will not work prior to DOMContentLoaded')
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"assert":28,"global/document":22,"global/window":23}],44:[function(require,module,exports){
var scheduler = require('nanoscheduler')()
var assert = require('assert')

var entryTypes = [
  'frame',
  'measure',
  'navigation',
  'resource',
  'longtask'
]

module.exports = onPerformance

function onPerformance (cb) {
  assert.equal(typeof cb, 'function', 'on-performance: cb should be type function')

  var PerformanceObserver = typeof window !== 'undefined' && window.PerformanceObserver
  if (!PerformanceObserver) return

  // Enable singleton.
  if (window._onperformance) {
    window._onperformance.push(cb)
    return stop
  }

  window._onperformance = [cb]
  var observer = new PerformanceObserver(parseEntries)
  setTimeout(function () {
    parseEntries(window.performance)
    observer.observe({ entryTypes: entryTypes })
  }, 0)

  return stop

  function stop () {
    window._onperformance.splice(window._onperformance.indexOf(cb), 1)
  }

  function parseEntries (list) {
    list.getEntries().forEach(function (entry) {
      scheduler.push(function () {
        clear(entry)
        window._onperformance.forEach(function (cb) {
          cb(entry)
        })
      })
    })
  }

  // Navigation, longtask and frame don't have a clear method (yet)
  // Resource timings can only be cleared in bulk
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Performance/clearMeasures
  function clear (entry) {
    var type = entry.entryType
    if (type === 'measure') window.performance.clearMeasures(entry.name)
    else if (type === 'resource') window.performance.clearResourceTimings()
  }
}

},{"assert":28,"nanoscheduler":40}],45:[function(require,module,exports){
module.exports = plucker

function plucker(path, object) {
  return arguments.length >= 2
    ? pluck(path)(object)
    : pluck(path)
}

function pluck(path) {
  path = typeof path === 'string'
    ? String(path).trim().split('.')
    : path

  if (path.length < 2) {
    path = path[0]
    return pluckSingle
  } else {
    var l = path.length
    return pluckPath
  }

  function pluckSingle(object) {
    return object[path]
  }

  function pluckPath(object) {
    for (var i = 0; i < l; i++) {
      if (typeof object === 'undefined') break

      object = object[path[i]]
    }

    return object
  }
}

},{}],46:[function(require,module,exports){
module.exports = prettierBytes

function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number(num / Math.pow(1000, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}

},{}],47:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],48:[function(require,module,exports){
'use strict'

/**
 * Remove a range of items from an array
 *
 * @function removeItems
 * @param {Array<*>} arr The target array
 * @param {number} startIdx The index to begin removing from (inclusive)
 * @param {number} removeCount How many items to remove
 */
module.exports = function removeItems(arr, startIdx, removeCount)
{
  var i, length = arr.length

  if (startIdx >= length || removeCount === 0) {
    return
  }

  removeCount = (startIdx + removeCount > length ? length - startIdx : removeCount)

  var len = length - removeCount

  for (i = startIdx; i < len; ++i) {
    arr[i] = arr[i + removeCount]
  }

  arr.length = len
}

},{}],49:[function(require,module,exports){
module.exports = scrollToAnchor

function scrollToAnchor (anchor, options) {
  if (anchor) {
    try {
      var el = document.querySelector(anchor)
      if (el) el.scrollIntoView(options)
    } catch (e) {}
  }
}

},{}],50:[function(require,module,exports){
module.exports = require('insert-css')

},{"insert-css":27}],51:[function(require,module,exports){
var fastSafeStringify = require('fast-safe-stringify')
var copy = require('copy-text-to-clipboard')

function tryStringify (obj) {
  try {
    return JSON.stringify(obj)
  } catch (e) {}
}

function stateCopy (obj) {
  var str = tryStringify(obj) || fastSafeStringify(obj)
  copy(str)
}

module.exports = stateCopy


},{"copy-text-to-clipboard":19,"fast-safe-stringify":21}],52:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],53:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],54:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":53,"_process":47,"inherits":52}],55:[function(require,module,exports){
var assert = require('assert')

module.exports = getAllRoutes

var transform = function (trie, previous) {
  var prev = previous || '/'
  var routes = {}
  var nodes = trie.nodes
  Object.keys(nodes).forEach(function (key) {
    var path = (prev === '/' ? prev : prev + '/') + (key === '$$' ? ':' + trie.name : key)
    var cb = nodes[key].cb
    if (cb !== undefined) {
      routes[path] = cb
    }
    if (Object.keys(nodes[key].nodes).length !== 0) {
      var obj = transform(nodes[key], path)
      Object.keys(obj).forEach(function (r) {
        routes[r] = obj[r]
      })
    }
  })
  return routes
}

// walk a wayfarer trie
// (obj, fn) -> null
function getAllRoutes (router) {
  assert.equal(typeof router, 'function', 'wayfarer.getAllRoutes: router should be an function')

  var trie = router._trie
  assert.equal(typeof trie, 'object', 'wayfarer.getAllRoutes: trie should be an object')

  var tree = trie.trie
  return transform(tree)
}

},{"assert":1}],56:[function(require,module,exports){
var assert = require('assert')
var trie = require('./trie')

module.exports = Wayfarer

// create a router
// str -> obj
function Wayfarer (dft) {
  if (!(this instanceof Wayfarer)) return new Wayfarer(dft)

  var _default = (dft || '').replace(/^\//, '')
  var _trie = trie()

  emit._trie = _trie
  emit.on = on
  emit.emit = emit
  emit.match = match
  emit._wayfarer = true

  return emit

  // define a route
  // (str, fn) -> obj
  function on (route, cb) {
    assert.equal(typeof route, 'string')
    assert.equal(typeof cb, 'function')

    route = route || '/'
    cb.route = route

    if (cb && cb._wayfarer && cb._trie) {
      _trie.mount(route, cb._trie.trie)
    } else {
      var node = _trie.create(route)
      node.cb = cb
    }

    return emit
  }

  // match and call a route
  // (str, obj?) -> null
  function emit (route) {
    var matched = match(route)

    var args = new Array(arguments.length)
    args[0] = matched.params
    for (var i = 1; i < args.length; i++) {
      args[i] = arguments[i]
    }

    return matched.cb.apply(matched.cb, args)
  }

  function match (route) {
    assert.notEqual(route, undefined, "'route' must be defined")

    var matched = _trie.match(route)
    if (matched && matched.cb) return new Route(matched)

    var dft = _trie.match(_default)
    if (dft && dft.cb) return new Route(dft)

    throw new Error("route '" + route + "' did not match")
  }

  function Route (matched) {
    this.cb = matched.cb
    this.route = matched.cb.route
    this.params = matched.params
  }
}

},{"./trie":57,"assert":1}],57:[function(require,module,exports){
var mutate = require('xtend/mutable')
var assert = require('assert')
var xtend = require('xtend')

module.exports = Trie

// create a new trie
// null -> obj
function Trie () {
  if (!(this instanceof Trie)) return new Trie()
  this.trie = { nodes: {} }
}

// create a node on the trie at route
// and return a node
// str -> null
Trie.prototype.create = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')
  // strip leading '/' and split routes
  var routes = route.replace(/^\//, '').split('/')

  function createNode (index, trie) {
    var thisRoute = (routes.hasOwnProperty(index) && routes[index])
    if (thisRoute === false) return trie

    var node = null
    if (/^:|^\*/.test(thisRoute)) {
      // if node is a name match, set name and append to ':' node
      if (!trie.nodes.hasOwnProperty('$$')) {
        node = { nodes: {} }
        trie.nodes['$$'] = node
      } else {
        node = trie.nodes['$$']
      }

      if (thisRoute[0] === '*') {
        trie.wildcard = true
      }

      trie.name = thisRoute.replace(/^:|^\*/, '')
    } else if (!trie.nodes.hasOwnProperty(thisRoute)) {
      node = { nodes: {} }
      trie.nodes[thisRoute] = node
    } else {
      node = trie.nodes[thisRoute]
    }

    // we must recurse deeper
    return createNode(index + 1, node)
  }

  return createNode(0, this.trie)
}

// match a route on the trie
// and return the node
// str -> obj
Trie.prototype.match = function (route) {
  assert.equal(typeof route, 'string', 'route should be a string')

  var routes = route.replace(/^\//, '').split('/')
  var params = {}

  function search (index, trie) {
    // either there's no match, or we're done searching
    if (trie === undefined) return undefined
    var thisRoute = routes[index]
    if (thisRoute === undefined) return trie

    if (trie.nodes.hasOwnProperty(thisRoute)) {
      // match regular routes first
      return search(index + 1, trie.nodes[thisRoute])
    } else if (trie.name) {
      // match named routes
      try {
        params[trie.name] = decodeURIComponent(thisRoute)
      } catch (e) {
        return search(index, undefined)
      }
      return search(index + 1, trie.nodes['$$'])
    } else if (trie.wildcard) {
      // match wildcards
      try {
        params['wildcard'] = decodeURIComponent(routes.slice(index).join('/'))
      } catch (e) {
        return search(index, undefined)
      }
      // return early, or else search may keep recursing through the wildcard
      return trie.nodes['$$']
    } else {
      // no matches found
      return search(index + 1)
    }
  }

  var node = search(0, this.trie)

  if (!node) return undefined
  node = xtend(node)
  node.params = params
  return node
}

// mount a trie onto a node at route
// (str, obj) -> null
Trie.prototype.mount = function (route, trie) {
  assert.equal(typeof route, 'string', 'route should be a string')
  assert.equal(typeof trie, 'object', 'trie should be a object')

  var split = route.replace(/^\//, '').split('/')
  var node = null
  var key = null

  if (split.length === 1) {
    key = split[0]
    node = this.create(key)
  } else {
    var head = split.join('/')
    key = split[0]
    node = this.create(head)
  }

  mutate(node.nodes, trie.nodes)
  if (trie.name) node.name = trie.name

  // delegate properties from '/' to the new node
  // '/' cannot be reached once mounted
  if (node.nodes['']) {
    Object.keys(node.nodes['']).forEach(function (key) {
      if (key === 'nodes') return
      node[key] = node.nodes[''][key]
    })
    mutate(node.nodes, node.nodes[''].nodes)
    delete node.nodes[''].nodes
  }
}

},{"assert":1,"xtend":58,"xtend/mutable":59}],58:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],59:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],60:[function(require,module,exports){
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

},{"choo/html":16,"nanocomponent":30}],61:[function(require,module,exports){
var { createFS } = require('./lib/mobile-fs')
var choo = require('choo')
var devtools = require('choo-devtools')
var sheetify = 0
var nanoquery = require('nanoquery')

choo.prototype._matchRoute = function (locationOverride) {
  var location, queryString
  if (locationOverride) {
    location = locationOverride.replace(/\?.+$/, '')
    queryString = locationOverride
  } else {
    location = this._createLocation()
    queryString = window.location.search
  }
  var matched = this.router.match(location)
  this.state.href = location
  this.state.query = nanoquery(queryString)
  this.state.previousRoute = this.state.route
  this.state.route = matched.route
  this.state.params = matched.params
  this.state._handler = matched.cb
  return this.state
}

var routes = require('./routes')

;((require('sheetify/insert')("/*! TACHYONS v4.9.0 | http://tachyons.io */\n/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit;font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}/* 1 */ [type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}/* 1 */ menu,details{display:block}summary{display:list-item}canvas{display:inline-block}[hidden],template{display:none}.border-box,a,article,aside,blockquote,body,code,dd,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,html,input[type=email],input[type=number],input[type=password],input[type=tel],input[type=text],input[type=url],legend,li,main,nav,ol,p,pre,section,table,td,textarea,th,tr,ul{box-sizing:border-box}.aspect-ratio{height:0;position:relative}.aspect-ratio--16x9{padding-bottom:56.25%}.aspect-ratio--9x16{padding-bottom:177.77%}.aspect-ratio--4x3{padding-bottom:75%}.aspect-ratio--3x4{padding-bottom:133.33%}.aspect-ratio--6x4{padding-bottom:66.6%}.aspect-ratio--4x6{padding-bottom:150%}.aspect-ratio--8x5{padding-bottom:62.5%}.aspect-ratio--5x8{padding-bottom:160%}.aspect-ratio--7x5{padding-bottom:71.42%}.aspect-ratio--5x7{padding-bottom:140%}.aspect-ratio--1x1{padding-bottom:100%}.aspect-ratio--object{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;z-index:100}img{max-width:100%}.cover{background-size:cover!important}.contain{background-size:contain!important}.bg-center{background-position:50%}.bg-center,.bg-top{background-repeat:no-repeat}.bg-top{background-position:top}.bg-right{background-position:100%}.bg-bottom,.bg-right{background-repeat:no-repeat}.bg-bottom{background-position:bottom}.bg-left{background-repeat:no-repeat;background-position:0}.outline{outline:1px solid}.outline-transparent{outline:1px solid transparent}.outline-0{outline:0}.ba{border-style:solid;border-width:1px}.bt{border-top-style:solid;border-top-width:1px}.br{border-right-style:solid;border-right-width:1px}.bb{border-bottom-style:solid;border-bottom-width:1px}.bl{border-left-style:solid;border-left-width:1px}.bn{border-style:none;border-width:0}.b--black{border-color:#000}.b--near-black{border-color:#111}.b--dark-gray{border-color:#333}.b--mid-gray{border-color:#555}.b--gray{border-color:#777}.b--silver{border-color:#999}.b--light-silver{border-color:#aaa}.b--moon-gray{border-color:#ccc}.b--light-gray{border-color:#eee}.b--near-white{border-color:#f4f4f4}.b--white{border-color:#fff}.b--white-90{border-color:hsla(0,0%,100%,.9)}.b--white-80{border-color:hsla(0,0%,100%,.8)}.b--white-70{border-color:hsla(0,0%,100%,.7)}.b--white-60{border-color:hsla(0,0%,100%,.6)}.b--white-50{border-color:hsla(0,0%,100%,.5)}.b--white-40{border-color:hsla(0,0%,100%,.4)}.b--white-30{border-color:hsla(0,0%,100%,.3)}.b--white-20{border-color:hsla(0,0%,100%,.2)}.b--white-10{border-color:hsla(0,0%,100%,.1)}.b--white-05{border-color:hsla(0,0%,100%,.05)}.b--white-025{border-color:hsla(0,0%,100%,.025)}.b--white-0125{border-color:hsla(0,0%,100%,.0125)}.b--black-90{border-color:rgba(0,0,0,.9)}.b--black-80{border-color:rgba(0,0,0,.8)}.b--black-70{border-color:rgba(0,0,0,.7)}.b--black-60{border-color:rgba(0,0,0,.6)}.b--black-50{border-color:rgba(0,0,0,.5)}.b--black-40{border-color:rgba(0,0,0,.4)}.b--black-30{border-color:rgba(0,0,0,.3)}.b--black-20{border-color:rgba(0,0,0,.2)}.b--black-10{border-color:rgba(0,0,0,.1)}.b--black-05{border-color:rgba(0,0,0,.05)}.b--black-025{border-color:rgba(0,0,0,.025)}.b--black-0125{border-color:rgba(0,0,0,.0125)}.b--dark-red{border-color:#e7040f}.b--red{border-color:#ff4136}.b--light-red{border-color:#ff725c}.b--orange{border-color:#ff6300}.b--gold{border-color:#ffb700}.b--yellow{border-color:gold}.b--light-yellow{border-color:#fbf1a9}.b--purple{border-color:#5e2ca5}.b--light-purple{border-color:#a463f2}.b--dark-pink{border-color:#d5008f}.b--hot-pink{border-color:#ff41b4}.b--pink{border-color:#ff80cc}.b--light-pink{border-color:#ffa3d7}.b--dark-green{border-color:#137752}.b--green{border-color:#19a974}.b--light-green{border-color:#9eebcf}.b--navy{border-color:#001b44}.b--dark-blue{border-color:#00449e}.b--blue{border-color:#357edd}.b--light-blue{border-color:#96ccff}.b--lightest-blue{border-color:#cdecff}.b--washed-blue{border-color:#f6fffe}.b--washed-green{border-color:#e8fdf5}.b--washed-yellow{border-color:#fffceb}.b--washed-red{border-color:#ffdfdf}.b--transparent{border-color:transparent}.b--inherit{border-color:inherit}.br0{border-radius:0}.br1{border-radius:.125rem}.br2{border-radius:.25rem}.br3{border-radius:.5rem}.br4{border-radius:1rem}.br-100{border-radius:100%}.br-pill{border-radius:9999px}.br--bottom{border-top-left-radius:0;border-top-right-radius:0}.br--top{border-bottom-right-radius:0}.br--right,.br--top{border-bottom-left-radius:0}.br--right{border-top-left-radius:0}.br--left{border-top-right-radius:0;border-bottom-right-radius:0}.b--dotted{border-style:dotted}.b--dashed{border-style:dashed}.b--solid{border-style:solid}.b--none{border-style:none}.bw0{border-width:0}.bw1{border-width:.125rem}.bw2{border-width:.25rem}.bw3{border-width:.5rem}.bw4{border-width:1rem}.bw5{border-width:2rem}.bt-0{border-top-width:0}.br-0{border-right-width:0}.bb-0{border-bottom-width:0}.bl-0{border-left-width:0}.shadow-1{box-shadow:0 0 4px 2px rgba(0,0,0,.2)}.shadow-2{box-shadow:0 0 8px 2px rgba(0,0,0,.2)}.shadow-3{box-shadow:2px 2px 4px 2px rgba(0,0,0,.2)}.shadow-4{box-shadow:2px 2px 8px 0 rgba(0,0,0,.2)}.shadow-5{box-shadow:4px 4px 8px 0 rgba(0,0,0,.2)}.pre{overflow-x:auto;overflow-y:hidden;overflow:scroll}.top-0{top:0}.right-0{right:0}.bottom-0{bottom:0}.left-0{left:0}.top-1{top:1rem}.right-1{right:1rem}.bottom-1{bottom:1rem}.left-1{left:1rem}.top-2{top:2rem}.right-2{right:2rem}.bottom-2{bottom:2rem}.left-2{left:2rem}.top--1{top:-1rem}.right--1{right:-1rem}.bottom--1{bottom:-1rem}.left--1{left:-1rem}.top--2{top:-2rem}.right--2{right:-2rem}.bottom--2{bottom:-2rem}.left--2{left:-2rem}.absolute--fill{top:0;right:0;bottom:0;left:0}.cf:after,.cf:before{content:\" \";display:table}.cf:after{clear:both}.cf{*zoom:1}.cl{clear:left}.cr{clear:right}.cb{clear:both}.cn{clear:none}.dn{display:none}.di{display:inline}.db{display:block}.dib{display:inline-block}.dit{display:inline-table}.dt{display:table}.dtc{display:table-cell}.dt-row{display:table-row}.dt-row-group{display:table-row-group}.dt-column{display:table-column}.dt-column-group{display:table-column-group}.dt--fixed{table-layout:fixed;width:100%}.flex{display:-webkit-box;display:-ms-flexbox;display:flex}.inline-flex{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.flex-auto{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;min-width:0;min-height:0}.flex-none{-webkit-box-flex:0;-ms-flex:none;flex:none}.flex-column{-webkit-box-orient:vertical;-ms-flex-direction:column;flex-direction:column}.flex-column,.flex-row{-webkit-box-direction:normal}.flex-row{-webkit-box-orient:horizontal;-ms-flex-direction:row;flex-direction:row}.flex-wrap{-ms-flex-wrap:wrap;flex-wrap:wrap}.flex-nowrap{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.flex-wrap-reverse{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.flex-column-reverse{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.flex-row-reverse{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.items-start{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.items-end{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.items-center{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.items-baseline{-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline}.items-stretch{-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.self-start{-ms-flex-item-align:start;align-self:flex-start}.self-end{-ms-flex-item-align:end;align-self:flex-end}.self-center{-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.self-baseline{-ms-flex-item-align:baseline;align-self:baseline}.self-stretch{-ms-flex-item-align:stretch;-ms-grid-row-align:stretch;align-self:stretch}.justify-start{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.justify-end{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.justify-center{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.justify-between{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.justify-around{-ms-flex-pack:distribute;justify-content:space-around}.content-start{-ms-flex-line-pack:start;align-content:flex-start}.content-end{-ms-flex-line-pack:end;align-content:flex-end}.content-center{-ms-flex-line-pack:center;align-content:center}.content-between{-ms-flex-line-pack:justify;align-content:space-between}.content-around{-ms-flex-line-pack:distribute;align-content:space-around}.content-stretch{-ms-flex-line-pack:stretch;align-content:stretch}.order-0{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-last{-webkit-box-ordinal-group:100000;-ms-flex-order:99999;order:99999}.flex-grow-0{-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0}.flex-grow-1{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1}.flex-shrink-0{-ms-flex-negative:0;flex-shrink:0}.flex-shrink-1{-ms-flex-negative:1;flex-shrink:1}.fl{float:left}.fl,.fr{_display:inline}.fr{float:right}.fn{float:none}.sans-serif{font-family:-apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,ubuntu,roboto,noto,segoe ui,arial,sans-serif}.serif{font-family:georgia,times,serif}.system-sans-serif{font-family:sans-serif}.system-serif{font-family:serif}.code,code{font-family:Consolas,monaco,monospace}.courier{font-family:Courier Next,courier,monospace}.helvetica{font-family:helvetica neue,helvetica,sans-serif}.avenir{font-family:avenir next,avenir,sans-serif}.athelas{font-family:athelas,georgia,serif}.georgia{font-family:georgia,serif}.times{font-family:times,serif}.bodoni{font-family:Bodoni MT,serif}.calisto{font-family:Calisto MT,serif}.garamond{font-family:garamond,serif}.baskerville{font-family:baskerville,serif}.i{font-style:italic}.fs-normal{font-style:normal}.normal{font-weight:400}.b{font-weight:700}.fw1{font-weight:100}.fw2{font-weight:200}.fw3{font-weight:300}.fw4{font-weight:400}.fw5{font-weight:500}.fw6{font-weight:600}.fw7{font-weight:700}.fw8{font-weight:800}.fw9{font-weight:900}.input-reset{-webkit-appearance:none;-moz-appearance:none}.button-reset::-moz-focus-inner,.input-reset::-moz-focus-inner{border:0;padding:0}.h1{height:1rem}.h2{height:2rem}.h3{height:4rem}.h4{height:8rem}.h5{height:16rem}.h-25{height:25%}.h-50{height:50%}.h-75{height:75%}.h-100{height:100%}.min-h-100{min-height:100%}.vh-25{height:25vh}.vh-50{height:50vh}.vh-75{height:75vh}.vh-100{height:100vh}.min-vh-100{min-height:100vh}.h-auto{height:auto}.h-inherit{height:inherit}.tracked{letter-spacing:.1em}.tracked-tight{letter-spacing:-.05em}.tracked-mega{letter-spacing:.25em}.lh-solid{line-height:1}.lh-title{line-height:1.25}.lh-copy{line-height:1.5}.link{text-decoration:none}.link,.link:active,.link:focus,.link:hover,.link:link,.link:visited{transition:color .15s ease-in}.link:focus{outline:1px dotted currentColor}.list{list-style-type:none}.mw-100{max-width:100%}.mw1{max-width:1rem}.mw2{max-width:2rem}.mw3{max-width:4rem}.mw4{max-width:8rem}.mw5{max-width:16rem}.mw6{max-width:32rem}.mw7{max-width:48rem}.mw8{max-width:64rem}.mw9{max-width:96rem}.mw-none{max-width:none}.w1{width:1rem}.w2{width:2rem}.w3{width:4rem}.w4{width:8rem}.w5{width:16rem}.w-10{width:10%}.w-20{width:20%}.w-25{width:25%}.w-30{width:30%}.w-33{width:33%}.w-34{width:34%}.w-40{width:40%}.w-50{width:50%}.w-60{width:60%}.w-70{width:70%}.w-75{width:75%}.w-80{width:80%}.w-90{width:90%}.w-100{width:100%}.w-third{width:33.33333%}.w-two-thirds{width:66.66667%}.w-auto{width:auto}.overflow-visible{overflow:visible}.overflow-hidden{overflow:hidden}.overflow-scroll{overflow:scroll}.overflow-auto{overflow:auto}.overflow-x-visible{overflow-x:visible}.overflow-x-hidden{overflow-x:hidden}.overflow-x-scroll{overflow-x:scroll}.overflow-x-auto{overflow-x:auto}.overflow-y-visible{overflow-y:visible}.overflow-y-hidden{overflow-y:hidden}.overflow-y-scroll{overflow-y:scroll}.overflow-y-auto{overflow-y:auto}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.o-100{opacity:1}.o-90{opacity:.9}.o-80{opacity:.8}.o-70{opacity:.7}.o-60{opacity:.6}.o-50{opacity:.5}.o-40{opacity:.4}.o-30{opacity:.3}.o-20{opacity:.2}.o-10{opacity:.1}.o-05{opacity:.05}.o-025{opacity:.025}.o-0{opacity:0}.rotate-45{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.rotate-90{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.rotate-135{-webkit-transform:rotate(135deg);transform:rotate(135deg)}.rotate-180{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.rotate-225{-webkit-transform:rotate(225deg);transform:rotate(225deg)}.rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.rotate-315{-webkit-transform:rotate(315deg);transform:rotate(315deg)}.black-90{color:rgba(0,0,0,.9)}.black-80{color:rgba(0,0,0,.8)}.black-70{color:rgba(0,0,0,.7)}.black-60{color:rgba(0,0,0,.6)}.black-50{color:rgba(0,0,0,.5)}.black-40{color:rgba(0,0,0,.4)}.black-30{color:rgba(0,0,0,.3)}.black-20{color:rgba(0,0,0,.2)}.black-10{color:rgba(0,0,0,.1)}.black-05{color:rgba(0,0,0,.05)}.white-90{color:hsla(0,0%,100%,.9)}.white-80{color:hsla(0,0%,100%,.8)}.white-70{color:hsla(0,0%,100%,.7)}.white-60{color:hsla(0,0%,100%,.6)}.white-50{color:hsla(0,0%,100%,.5)}.white-40{color:hsla(0,0%,100%,.4)}.white-30{color:hsla(0,0%,100%,.3)}.white-20{color:hsla(0,0%,100%,.2)}.white-10{color:hsla(0,0%,100%,.1)}.black{color:#000}.near-black{color:#111}.dark-gray{color:#333}.mid-gray{color:#555}.gray{color:#777}.silver{color:#999}.light-silver{color:#aaa}.moon-gray{color:#ccc}.light-gray{color:#eee}.near-white{color:#f4f4f4}.white{color:#fff}.dark-red{color:#e7040f}.red{color:#ff4136}.light-red{color:#ff725c}.orange{color:#ff6300}.gold{color:#ffb700}.yellow{color:gold}.light-yellow{color:#fbf1a9}.purple{color:#5e2ca5}.light-purple{color:#a463f2}.dark-pink{color:#d5008f}.hot-pink{color:#ff41b4}.pink{color:#ff80cc}.light-pink{color:#ffa3d7}.dark-green{color:#137752}.green{color:#19a974}.light-green{color:#9eebcf}.navy{color:#001b44}.dark-blue{color:#00449e}.blue{color:#357edd}.light-blue{color:#96ccff}.lightest-blue{color:#cdecff}.washed-blue{color:#f6fffe}.washed-green{color:#e8fdf5}.washed-yellow{color:#fffceb}.washed-red{color:#ffdfdf}.color-inherit{color:inherit}.bg-black-90{background-color:rgba(0,0,0,.9)}.bg-black-80{background-color:rgba(0,0,0,.8)}.bg-black-70{background-color:rgba(0,0,0,.7)}.bg-black-60{background-color:rgba(0,0,0,.6)}.bg-black-50{background-color:rgba(0,0,0,.5)}.bg-black-40{background-color:rgba(0,0,0,.4)}.bg-black-30{background-color:rgba(0,0,0,.3)}.bg-black-20{background-color:rgba(0,0,0,.2)}.bg-black-10{background-color:rgba(0,0,0,.1)}.bg-black-05{background-color:rgba(0,0,0,.05)}.bg-white-90{background-color:hsla(0,0%,100%,.9)}.bg-white-80{background-color:hsla(0,0%,100%,.8)}.bg-white-70{background-color:hsla(0,0%,100%,.7)}.bg-white-60{background-color:hsla(0,0%,100%,.6)}.bg-white-50{background-color:hsla(0,0%,100%,.5)}.bg-white-40{background-color:hsla(0,0%,100%,.4)}.bg-white-30{background-color:hsla(0,0%,100%,.3)}.bg-white-20{background-color:hsla(0,0%,100%,.2)}.bg-white-10{background-color:hsla(0,0%,100%,.1)}.bg-black{background-color:#000}.bg-near-black{background-color:#111}.bg-dark-gray{background-color:#333}.bg-mid-gray{background-color:#555}.bg-gray{background-color:#777}.bg-silver{background-color:#999}.bg-light-silver{background-color:#aaa}.bg-moon-gray{background-color:#ccc}.bg-light-gray{background-color:#eee}.bg-near-white{background-color:#f4f4f4}.bg-white{background-color:#fff}.bg-transparent{background-color:transparent}.bg-dark-red{background-color:#e7040f}.bg-red{background-color:#ff4136}.bg-light-red{background-color:#ff725c}.bg-orange{background-color:#ff6300}.bg-gold{background-color:#ffb700}.bg-yellow{background-color:gold}.bg-light-yellow{background-color:#fbf1a9}.bg-purple{background-color:#5e2ca5}.bg-light-purple{background-color:#a463f2}.bg-dark-pink{background-color:#d5008f}.bg-hot-pink{background-color:#ff41b4}.bg-pink{background-color:#ff80cc}.bg-light-pink{background-color:#ffa3d7}.bg-dark-green{background-color:#137752}.bg-green{background-color:#19a974}.bg-light-green{background-color:#9eebcf}.bg-navy{background-color:#001b44}.bg-dark-blue{background-color:#00449e}.bg-blue{background-color:#357edd}.bg-light-blue{background-color:#96ccff}.bg-lightest-blue{background-color:#cdecff}.bg-washed-blue{background-color:#f6fffe}.bg-washed-green{background-color:#e8fdf5}.bg-washed-yellow{background-color:#fffceb}.bg-washed-red{background-color:#ffdfdf}.bg-inherit{background-color:inherit}.hover-black:focus,.hover-black:hover{color:#000}.hover-near-black:focus,.hover-near-black:hover{color:#111}.hover-dark-gray:focus,.hover-dark-gray:hover{color:#333}.hover-mid-gray:focus,.hover-mid-gray:hover{color:#555}.hover-gray:focus,.hover-gray:hover{color:#777}.hover-silver:focus,.hover-silver:hover{color:#999}.hover-light-silver:focus,.hover-light-silver:hover{color:#aaa}.hover-moon-gray:focus,.hover-moon-gray:hover{color:#ccc}.hover-light-gray:focus,.hover-light-gray:hover{color:#eee}.hover-near-white:focus,.hover-near-white:hover{color:#f4f4f4}.hover-white:focus,.hover-white:hover{color:#fff}.hover-black-90:focus,.hover-black-90:hover{color:rgba(0,0,0,.9)}.hover-black-80:focus,.hover-black-80:hover{color:rgba(0,0,0,.8)}.hover-black-70:focus,.hover-black-70:hover{color:rgba(0,0,0,.7)}.hover-black-60:focus,.hover-black-60:hover{color:rgba(0,0,0,.6)}.hover-black-50:focus,.hover-black-50:hover{color:rgba(0,0,0,.5)}.hover-black-40:focus,.hover-black-40:hover{color:rgba(0,0,0,.4)}.hover-black-30:focus,.hover-black-30:hover{color:rgba(0,0,0,.3)}.hover-black-20:focus,.hover-black-20:hover{color:rgba(0,0,0,.2)}.hover-black-10:focus,.hover-black-10:hover{color:rgba(0,0,0,.1)}.hover-white-90:focus,.hover-white-90:hover{color:hsla(0,0%,100%,.9)}.hover-white-80:focus,.hover-white-80:hover{color:hsla(0,0%,100%,.8)}.hover-white-70:focus,.hover-white-70:hover{color:hsla(0,0%,100%,.7)}.hover-white-60:focus,.hover-white-60:hover{color:hsla(0,0%,100%,.6)}.hover-white-50:focus,.hover-white-50:hover{color:hsla(0,0%,100%,.5)}.hover-white-40:focus,.hover-white-40:hover{color:hsla(0,0%,100%,.4)}.hover-white-30:focus,.hover-white-30:hover{color:hsla(0,0%,100%,.3)}.hover-white-20:focus,.hover-white-20:hover{color:hsla(0,0%,100%,.2)}.hover-white-10:focus,.hover-white-10:hover{color:hsla(0,0%,100%,.1)}.hover-inherit:focus,.hover-inherit:hover{color:inherit}.hover-bg-black:focus,.hover-bg-black:hover{background-color:#000}.hover-bg-near-black:focus,.hover-bg-near-black:hover{background-color:#111}.hover-bg-dark-gray:focus,.hover-bg-dark-gray:hover{background-color:#333}.hover-bg-mid-gray:focus,.hover-bg-mid-gray:hover{background-color:#555}.hover-bg-gray:focus,.hover-bg-gray:hover{background-color:#777}.hover-bg-silver:focus,.hover-bg-silver:hover{background-color:#999}.hover-bg-light-silver:focus,.hover-bg-light-silver:hover{background-color:#aaa}.hover-bg-moon-gray:focus,.hover-bg-moon-gray:hover{background-color:#ccc}.hover-bg-light-gray:focus,.hover-bg-light-gray:hover{background-color:#eee}.hover-bg-near-white:focus,.hover-bg-near-white:hover{background-color:#f4f4f4}.hover-bg-white:focus,.hover-bg-white:hover{background-color:#fff}.hover-bg-transparent:focus,.hover-bg-transparent:hover{background-color:transparent}.hover-bg-black-90:focus,.hover-bg-black-90:hover{background-color:rgba(0,0,0,.9)}.hover-bg-black-80:focus,.hover-bg-black-80:hover{background-color:rgba(0,0,0,.8)}.hover-bg-black-70:focus,.hover-bg-black-70:hover{background-color:rgba(0,0,0,.7)}.hover-bg-black-60:focus,.hover-bg-black-60:hover{background-color:rgba(0,0,0,.6)}.hover-bg-black-50:focus,.hover-bg-black-50:hover{background-color:rgba(0,0,0,.5)}.hover-bg-black-40:focus,.hover-bg-black-40:hover{background-color:rgba(0,0,0,.4)}.hover-bg-black-30:focus,.hover-bg-black-30:hover{background-color:rgba(0,0,0,.3)}.hover-bg-black-20:focus,.hover-bg-black-20:hover{background-color:rgba(0,0,0,.2)}.hover-bg-black-10:focus,.hover-bg-black-10:hover{background-color:rgba(0,0,0,.1)}.hover-bg-white-90:focus,.hover-bg-white-90:hover{background-color:hsla(0,0%,100%,.9)}.hover-bg-white-80:focus,.hover-bg-white-80:hover{background-color:hsla(0,0%,100%,.8)}.hover-bg-white-70:focus,.hover-bg-white-70:hover{background-color:hsla(0,0%,100%,.7)}.hover-bg-white-60:focus,.hover-bg-white-60:hover{background-color:hsla(0,0%,100%,.6)}.hover-bg-white-50:focus,.hover-bg-white-50:hover{background-color:hsla(0,0%,100%,.5)}.hover-bg-white-40:focus,.hover-bg-white-40:hover{background-color:hsla(0,0%,100%,.4)}.hover-bg-white-30:focus,.hover-bg-white-30:hover{background-color:hsla(0,0%,100%,.3)}.hover-bg-white-20:focus,.hover-bg-white-20:hover{background-color:hsla(0,0%,100%,.2)}.hover-bg-white-10:focus,.hover-bg-white-10:hover{background-color:hsla(0,0%,100%,.1)}.hover-dark-red:focus,.hover-dark-red:hover{color:#e7040f}.hover-red:focus,.hover-red:hover{color:#ff4136}.hover-light-red:focus,.hover-light-red:hover{color:#ff725c}.hover-orange:focus,.hover-orange:hover{color:#ff6300}.hover-gold:focus,.hover-gold:hover{color:#ffb700}.hover-yellow:focus,.hover-yellow:hover{color:gold}.hover-light-yellow:focus,.hover-light-yellow:hover{color:#fbf1a9}.hover-purple:focus,.hover-purple:hover{color:#5e2ca5}.hover-light-purple:focus,.hover-light-purple:hover{color:#a463f2}.hover-dark-pink:focus,.hover-dark-pink:hover{color:#d5008f}.hover-hot-pink:focus,.hover-hot-pink:hover{color:#ff41b4}.hover-pink:focus,.hover-pink:hover{color:#ff80cc}.hover-light-pink:focus,.hover-light-pink:hover{color:#ffa3d7}.hover-dark-green:focus,.hover-dark-green:hover{color:#137752}.hover-green:focus,.hover-green:hover{color:#19a974}.hover-light-green:focus,.hover-light-green:hover{color:#9eebcf}.hover-navy:focus,.hover-navy:hover{color:#001b44}.hover-dark-blue:focus,.hover-dark-blue:hover{color:#00449e}.hover-blue:focus,.hover-blue:hover{color:#357edd}.hover-light-blue:focus,.hover-light-blue:hover{color:#96ccff}.hover-lightest-blue:focus,.hover-lightest-blue:hover{color:#cdecff}.hover-washed-blue:focus,.hover-washed-blue:hover{color:#f6fffe}.hover-washed-green:focus,.hover-washed-green:hover{color:#e8fdf5}.hover-washed-yellow:focus,.hover-washed-yellow:hover{color:#fffceb}.hover-washed-red:focus,.hover-washed-red:hover{color:#ffdfdf}.hover-bg-dark-red:focus,.hover-bg-dark-red:hover{background-color:#e7040f}.hover-bg-red:focus,.hover-bg-red:hover{background-color:#ff4136}.hover-bg-light-red:focus,.hover-bg-light-red:hover{background-color:#ff725c}.hover-bg-orange:focus,.hover-bg-orange:hover{background-color:#ff6300}.hover-bg-gold:focus,.hover-bg-gold:hover{background-color:#ffb700}.hover-bg-yellow:focus,.hover-bg-yellow:hover{background-color:gold}.hover-bg-light-yellow:focus,.hover-bg-light-yellow:hover{background-color:#fbf1a9}.hover-bg-purple:focus,.hover-bg-purple:hover{background-color:#5e2ca5}.hover-bg-light-purple:focus,.hover-bg-light-purple:hover{background-color:#a463f2}.hover-bg-dark-pink:focus,.hover-bg-dark-pink:hover{background-color:#d5008f}.hover-bg-hot-pink:focus,.hover-bg-hot-pink:hover{background-color:#ff41b4}.hover-bg-pink:focus,.hover-bg-pink:hover{background-color:#ff80cc}.hover-bg-light-pink:focus,.hover-bg-light-pink:hover{background-color:#ffa3d7}.hover-bg-dark-green:focus,.hover-bg-dark-green:hover{background-color:#137752}.hover-bg-green:focus,.hover-bg-green:hover{background-color:#19a974}.hover-bg-light-green:focus,.hover-bg-light-green:hover{background-color:#9eebcf}.hover-bg-navy:focus,.hover-bg-navy:hover{background-color:#001b44}.hover-bg-dark-blue:focus,.hover-bg-dark-blue:hover{background-color:#00449e}.hover-bg-blue:focus,.hover-bg-blue:hover{background-color:#357edd}.hover-bg-light-blue:focus,.hover-bg-light-blue:hover{background-color:#96ccff}.hover-bg-lightest-blue:focus,.hover-bg-lightest-blue:hover{background-color:#cdecff}.hover-bg-washed-blue:focus,.hover-bg-washed-blue:hover{background-color:#f6fffe}.hover-bg-washed-green:focus,.hover-bg-washed-green:hover{background-color:#e8fdf5}.hover-bg-washed-yellow:focus,.hover-bg-washed-yellow:hover{background-color:#fffceb}.hover-bg-washed-red:focus,.hover-bg-washed-red:hover{background-color:#ffdfdf}.hover-bg-inherit:focus,.hover-bg-inherit:hover{background-color:inherit}.pa0{padding:0}.pa1{padding:.25rem}.pa2{padding:.5rem}.pa3{padding:1rem}.pa4{padding:2rem}.pa5{padding:4rem}.pa6{padding:8rem}.pa7{padding:16rem}.pl0{padding-left:0}.pl1{padding-left:.25rem}.pl2{padding-left:.5rem}.pl3{padding-left:1rem}.pl4{padding-left:2rem}.pl5{padding-left:4rem}.pl6{padding-left:8rem}.pl7{padding-left:16rem}.pr0{padding-right:0}.pr1{padding-right:.25rem}.pr2{padding-right:.5rem}.pr3{padding-right:1rem}.pr4{padding-right:2rem}.pr5{padding-right:4rem}.pr6{padding-right:8rem}.pr7{padding-right:16rem}.pb0{padding-bottom:0}.pb1{padding-bottom:.25rem}.pb2{padding-bottom:.5rem}.pb3{padding-bottom:1rem}.pb4{padding-bottom:2rem}.pb5{padding-bottom:4rem}.pb6{padding-bottom:8rem}.pb7{padding-bottom:16rem}.pt0{padding-top:0}.pt1{padding-top:.25rem}.pt2{padding-top:.5rem}.pt3{padding-top:1rem}.pt4{padding-top:2rem}.pt5{padding-top:4rem}.pt6{padding-top:8rem}.pt7{padding-top:16rem}.pv0{padding-top:0;padding-bottom:0}.pv1{padding-top:.25rem;padding-bottom:.25rem}.pv2{padding-top:.5rem;padding-bottom:.5rem}.pv3{padding-top:1rem;padding-bottom:1rem}.pv4{padding-top:2rem;padding-bottom:2rem}.pv5{padding-top:4rem;padding-bottom:4rem}.pv6{padding-top:8rem;padding-bottom:8rem}.pv7{padding-top:16rem;padding-bottom:16rem}.ph0{padding-left:0;padding-right:0}.ph1{padding-left:.25rem;padding-right:.25rem}.ph2{padding-left:.5rem;padding-right:.5rem}.ph3{padding-left:1rem;padding-right:1rem}.ph4{padding-left:2rem;padding-right:2rem}.ph5{padding-left:4rem;padding-right:4rem}.ph6{padding-left:8rem;padding-right:8rem}.ph7{padding-left:16rem;padding-right:16rem}.ma0{margin:0}.ma1{margin:.25rem}.ma2{margin:.5rem}.ma3{margin:1rem}.ma4{margin:2rem}.ma5{margin:4rem}.ma6{margin:8rem}.ma7{margin:16rem}.ml0{margin-left:0}.ml1{margin-left:.25rem}.ml2{margin-left:.5rem}.ml3{margin-left:1rem}.ml4{margin-left:2rem}.ml5{margin-left:4rem}.ml6{margin-left:8rem}.ml7{margin-left:16rem}.mr0{margin-right:0}.mr1{margin-right:.25rem}.mr2{margin-right:.5rem}.mr3{margin-right:1rem}.mr4{margin-right:2rem}.mr5{margin-right:4rem}.mr6{margin-right:8rem}.mr7{margin-right:16rem}.mb0{margin-bottom:0}.mb1{margin-bottom:.25rem}.mb2{margin-bottom:.5rem}.mb3{margin-bottom:1rem}.mb4{margin-bottom:2rem}.mb5{margin-bottom:4rem}.mb6{margin-bottom:8rem}.mb7{margin-bottom:16rem}.mt0{margin-top:0}.mt1{margin-top:.25rem}.mt2{margin-top:.5rem}.mt3{margin-top:1rem}.mt4{margin-top:2rem}.mt5{margin-top:4rem}.mt6{margin-top:8rem}.mt7{margin-top:16rem}.mv0{margin-top:0;margin-bottom:0}.mv1{margin-top:.25rem;margin-bottom:.25rem}.mv2{margin-top:.5rem;margin-bottom:.5rem}.mv3{margin-top:1rem;margin-bottom:1rem}.mv4{margin-top:2rem;margin-bottom:2rem}.mv5{margin-top:4rem;margin-bottom:4rem}.mv6{margin-top:8rem;margin-bottom:8rem}.mv7{margin-top:16rem;margin-bottom:16rem}.mh0{margin-left:0;margin-right:0}.mh1{margin-left:.25rem;margin-right:.25rem}.mh2{margin-left:.5rem;margin-right:.5rem}.mh3{margin-left:1rem;margin-right:1rem}.mh4{margin-left:2rem;margin-right:2rem}.mh5{margin-left:4rem;margin-right:4rem}.mh6{margin-left:8rem;margin-right:8rem}.mh7{margin-left:16rem;margin-right:16rem}.na1{margin:-.25rem}.na2{margin:-.5rem}.na3{margin:-1rem}.na4{margin:-2rem}.na5{margin:-4rem}.na6{margin:-8rem}.na7{margin:-16rem}.nl1{margin-left:-.25rem}.nl2{margin-left:-.5rem}.nl3{margin-left:-1rem}.nl4{margin-left:-2rem}.nl5{margin-left:-4rem}.nl6{margin-left:-8rem}.nl7{margin-left:-16rem}.nr1{margin-right:-.25rem}.nr2{margin-right:-.5rem}.nr3{margin-right:-1rem}.nr4{margin-right:-2rem}.nr5{margin-right:-4rem}.nr6{margin-right:-8rem}.nr7{margin-right:-16rem}.nb1{margin-bottom:-.25rem}.nb2{margin-bottom:-.5rem}.nb3{margin-bottom:-1rem}.nb4{margin-bottom:-2rem}.nb5{margin-bottom:-4rem}.nb6{margin-bottom:-8rem}.nb7{margin-bottom:-16rem}.nt1{margin-top:-.25rem}.nt2{margin-top:-.5rem}.nt3{margin-top:-1rem}.nt4{margin-top:-2rem}.nt5{margin-top:-4rem}.nt6{margin-top:-8rem}.nt7{margin-top:-16rem}.collapse{border-collapse:collapse;border-spacing:0}.striped--light-silver:nth-child(odd){background-color:#aaa}.striped--moon-gray:nth-child(odd){background-color:#ccc}.striped--light-gray:nth-child(odd){background-color:#eee}.striped--near-white:nth-child(odd){background-color:#f4f4f4}.stripe-light:nth-child(odd){background-color:hsla(0,0%,100%,.1)}.stripe-dark:nth-child(odd){background-color:rgba(0,0,0,.1)}.strike{text-decoration:line-through}.underline{text-decoration:underline}.no-underline{text-decoration:none}.tl{text-align:left}.tr{text-align:right}.tc{text-align:center}.tj{text-align:justify}.ttc{text-transform:capitalize}.ttl{text-transform:lowercase}.ttu{text-transform:uppercase}.ttn{text-transform:none}.f-6,.f-headline{font-size:6rem}.f-5,.f-subheadline{font-size:5rem}.f1{font-size:3rem}.f2{font-size:2.25rem}.f3{font-size:1.5rem}.f4{font-size:1.25rem}.f5{font-size:1rem}.f6{font-size:.875rem}.f7{font-size:.75rem}.measure{max-width:30em}.measure-wide{max-width:34em}.measure-narrow{max-width:20em}.indent{text-indent:1em;margin-top:0;margin-bottom:0}.small-caps{font-variant:small-caps}.truncate{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.overflow-container{overflow-y:scroll}.center{margin-left:auto}.center,.mr-auto{margin-right:auto}.ml-auto{margin-left:auto}.clip{position:fixed!important;_position:absolute!important;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px)}.ws-normal{white-space:normal}.nowrap{white-space:nowrap}.pre{white-space:pre}.v-base{vertical-align:baseline}.v-mid{vertical-align:middle}.v-top{vertical-align:top}.v-btm{vertical-align:bottom}.dim{opacity:1}.dim,.dim:focus,.dim:hover{transition:opacity .15s ease-in}.dim:focus,.dim:hover{opacity:.5}.dim:active{opacity:.8;transition:opacity .15s ease-out}.glow,.glow:focus,.glow:hover{transition:opacity .15s ease-in}.glow:focus,.glow:hover{opacity:1}.hide-child .child{opacity:0;transition:opacity .15s ease-in}.hide-child:active .child,.hide-child:focus .child,.hide-child:hover .child{opacity:1;transition:opacity .15s ease-in}.underline-hover:focus,.underline-hover:hover{text-decoration:underline}.grow{-moz-osx-font-smoothing:grayscale;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform:translateZ(0);transform:translateZ(0);transition:-webkit-transform .25s ease-out;transition:transform .25s ease-out;transition:transform .25s ease-out,-webkit-transform .25s ease-out}.grow:focus,.grow:hover{-webkit-transform:scale(1.05);transform:scale(1.05)}.grow:active{-webkit-transform:scale(.9);transform:scale(.9)}.grow-large{-moz-osx-font-smoothing:grayscale;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform:translateZ(0);transform:translateZ(0);transition:-webkit-transform .25s ease-in-out;transition:transform .25s ease-in-out;transition:transform .25s ease-in-out,-webkit-transform .25s ease-in-out}.grow-large:focus,.grow-large:hover{-webkit-transform:scale(1.2);transform:scale(1.2)}.grow-large:active{-webkit-transform:scale(.95);transform:scale(.95)}.pointer:hover,.shadow-hover{cursor:pointer}.shadow-hover{position:relative;transition:all .5s cubic-bezier(.165,.84,.44,1)}.shadow-hover:after{content:\"\";box-shadow:0 0 16px 2px rgba(0,0,0,.2);border-radius:inherit;opacity:0;position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;transition:opacity .5s cubic-bezier(.165,.84,.44,1)}.shadow-hover:focus:after,.shadow-hover:hover:after{opacity:1}.bg-animate,.bg-animate:focus,.bg-animate:hover{transition:background-color .15s ease-in-out}.z-0{z-index:0}.z-1{z-index:1}.z-2{z-index:2}.z-3{z-index:3}.z-4{z-index:4}.z-5{z-index:5}.z-999{z-index:999}.z-9999{z-index:9999}.z-max{z-index:2147483647}.z-inherit{z-index:inherit}.z-initial{z-index:auto}.z-unset{z-index:unset}.nested-copy-line-height ol,.nested-copy-line-height p,.nested-copy-line-height ul{line-height:1.5}.nested-headline-line-height h1,.nested-headline-line-height h2,.nested-headline-line-height h3,.nested-headline-line-height h4,.nested-headline-line-height h5,.nested-headline-line-height h6{line-height:1.25}.nested-list-reset ol,.nested-list-reset ul{padding-left:0;margin-left:0;list-style-type:none}.nested-copy-indent p+p{text-indent:1em;margin-top:0;margin-bottom:0}.nested-copy-separator p+p{margin-top:1.5em}.nested-img img{width:100%;max-width:100%;display:block}.nested-links a{color:#357edd;transition:color .15s ease-in}.nested-links a:focus,.nested-links a:hover{color:#96ccff;transition:color .15s ease-in}.debug *{outline:1px solid gold}.debug-white *{outline:1px solid #fff}.debug-black *{outline:1px solid #000}.debug-grid{background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFElEQVR4AWPAC97/9x0eCsAEPgwAVLshdpENIxcAAAAASUVORK5CYII=) repeat 0 0}.debug-grid-16{background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVR4AWOgCLz/b0epAa6UGuBOqQHOQHLUgFEDnAbcBZ4UGwDOkiCnkIhdgNgNxAYAiYlD+8sEuo8AAAAASUVORK5CYII=) repeat 0 0}.debug-grid-8-solid{background:#fff url(data:image/gif;base64,R0lGODdhCAAIAPEAAADw/wDx/////wAAACwAAAAACAAIAAACDZQvgaeb/lxbAIKA8y0AOw==) repeat 0 0}.debug-grid-16-solid{background:#fff url(data:image/gif;base64,R0lGODdhEAAQAPEAAADw/wDx/xXy/////ywAAAAAEAAQAAACIZyPKckYDQFsb6ZqD85jZ2+BkwiRFKehhqQCQgDHcgwEBQA7) repeat 0 0}@media screen and (min-width:30em){.aspect-ratio-ns{height:0;position:relative}.aspect-ratio--16x9-ns{padding-bottom:56.25%}.aspect-ratio--9x16-ns{padding-bottom:177.77%}.aspect-ratio--4x3-ns{padding-bottom:75%}.aspect-ratio--3x4-ns{padding-bottom:133.33%}.aspect-ratio--6x4-ns{padding-bottom:66.6%}.aspect-ratio--4x6-ns{padding-bottom:150%}.aspect-ratio--8x5-ns{padding-bottom:62.5%}.aspect-ratio--5x8-ns{padding-bottom:160%}.aspect-ratio--7x5-ns{padding-bottom:71.42%}.aspect-ratio--5x7-ns{padding-bottom:140%}.aspect-ratio--1x1-ns{padding-bottom:100%}.aspect-ratio--object-ns{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;z-index:100}.cover-ns{background-size:cover!important}.contain-ns{background-size:contain!important}.bg-center-ns{background-position:50%}.bg-center-ns,.bg-top-ns{background-repeat:no-repeat}.bg-top-ns{background-position:top}.bg-right-ns{background-position:100%}.bg-bottom-ns,.bg-right-ns{background-repeat:no-repeat}.bg-bottom-ns{background-position:bottom}.bg-left-ns{background-repeat:no-repeat;background-position:0}.outline-ns{outline:1px solid}.outline-transparent-ns{outline:1px solid transparent}.outline-0-ns{outline:0}.ba-ns{border-style:solid;border-width:1px}.bt-ns{border-top-style:solid;border-top-width:1px}.br-ns{border-right-style:solid;border-right-width:1px}.bb-ns{border-bottom-style:solid;border-bottom-width:1px}.bl-ns{border-left-style:solid;border-left-width:1px}.bn-ns{border-style:none;border-width:0}.br0-ns{border-radius:0}.br1-ns{border-radius:.125rem}.br2-ns{border-radius:.25rem}.br3-ns{border-radius:.5rem}.br4-ns{border-radius:1rem}.br-100-ns{border-radius:100%}.br-pill-ns{border-radius:9999px}.br--bottom-ns{border-top-left-radius:0;border-top-right-radius:0}.br--top-ns{border-bottom-right-radius:0}.br--right-ns,.br--top-ns{border-bottom-left-radius:0}.br--right-ns{border-top-left-radius:0}.br--left-ns{border-top-right-radius:0;border-bottom-right-radius:0}.b--dotted-ns{border-style:dotted}.b--dashed-ns{border-style:dashed}.b--solid-ns{border-style:solid}.b--none-ns{border-style:none}.bw0-ns{border-width:0}.bw1-ns{border-width:.125rem}.bw2-ns{border-width:.25rem}.bw3-ns{border-width:.5rem}.bw4-ns{border-width:1rem}.bw5-ns{border-width:2rem}.bt-0-ns{border-top-width:0}.br-0-ns{border-right-width:0}.bb-0-ns{border-bottom-width:0}.bl-0-ns{border-left-width:0}.shadow-1-ns{box-shadow:0 0 4px 2px rgba(0,0,0,.2)}.shadow-2-ns{box-shadow:0 0 8px 2px rgba(0,0,0,.2)}.shadow-3-ns{box-shadow:2px 2px 4px 2px rgba(0,0,0,.2)}.shadow-4-ns{box-shadow:2px 2px 8px 0 rgba(0,0,0,.2)}.shadow-5-ns{box-shadow:4px 4px 8px 0 rgba(0,0,0,.2)}.top-0-ns{top:0}.left-0-ns{left:0}.right-0-ns{right:0}.bottom-0-ns{bottom:0}.top-1-ns{top:1rem}.left-1-ns{left:1rem}.right-1-ns{right:1rem}.bottom-1-ns{bottom:1rem}.top-2-ns{top:2rem}.left-2-ns{left:2rem}.right-2-ns{right:2rem}.bottom-2-ns{bottom:2rem}.top--1-ns{top:-1rem}.right--1-ns{right:-1rem}.bottom--1-ns{bottom:-1rem}.left--1-ns{left:-1rem}.top--2-ns{top:-2rem}.right--2-ns{right:-2rem}.bottom--2-ns{bottom:-2rem}.left--2-ns{left:-2rem}.absolute--fill-ns{top:0;right:0;bottom:0;left:0}.cl-ns{clear:left}.cr-ns{clear:right}.cb-ns{clear:both}.cn-ns{clear:none}.dn-ns{display:none}.di-ns{display:inline}.db-ns{display:block}.dib-ns{display:inline-block}.dit-ns{display:inline-table}.dt-ns{display:table}.dtc-ns{display:table-cell}.dt-row-ns{display:table-row}.dt-row-group-ns{display:table-row-group}.dt-column-ns{display:table-column}.dt-column-group-ns{display:table-column-group}.dt--fixed-ns{table-layout:fixed;width:100%}.flex-ns{display:-webkit-box;display:-ms-flexbox;display:flex}.inline-flex-ns{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.flex-auto-ns{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;min-width:0;min-height:0}.flex-none-ns{-webkit-box-flex:0;-ms-flex:none;flex:none}.flex-column-ns{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.flex-row-ns{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.flex-wrap-ns{-ms-flex-wrap:wrap;flex-wrap:wrap}.flex-nowrap-ns{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.flex-wrap-reverse-ns{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.flex-column-reverse-ns{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.flex-row-reverse-ns{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.items-start-ns{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.items-end-ns{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.items-center-ns{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.items-baseline-ns{-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline}.items-stretch-ns{-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.self-start-ns{-ms-flex-item-align:start;align-self:flex-start}.self-end-ns{-ms-flex-item-align:end;align-self:flex-end}.self-center-ns{-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.self-baseline-ns{-ms-flex-item-align:baseline;align-self:baseline}.self-stretch-ns{-ms-flex-item-align:stretch;-ms-grid-row-align:stretch;align-self:stretch}.justify-start-ns{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.justify-end-ns{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.justify-center-ns{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.justify-between-ns{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.justify-around-ns{-ms-flex-pack:distribute;justify-content:space-around}.content-start-ns{-ms-flex-line-pack:start;align-content:flex-start}.content-end-ns{-ms-flex-line-pack:end;align-content:flex-end}.content-center-ns{-ms-flex-line-pack:center;align-content:center}.content-between-ns{-ms-flex-line-pack:justify;align-content:space-between}.content-around-ns{-ms-flex-line-pack:distribute;align-content:space-around}.content-stretch-ns{-ms-flex-line-pack:stretch;align-content:stretch}.order-0-ns{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-1-ns{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-2-ns{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-3-ns{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-4-ns{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-5-ns{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-6-ns{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-7-ns{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-8-ns{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-last-ns{-webkit-box-ordinal-group:100000;-ms-flex-order:99999;order:99999}.flex-grow-0-ns{-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0}.flex-grow-1-ns{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1}.flex-shrink-0-ns{-ms-flex-negative:0;flex-shrink:0}.flex-shrink-1-ns{-ms-flex-negative:1;flex-shrink:1}.fl-ns{float:left}.fl-ns,.fr-ns{display:inline}.fr-ns{float:right}.fn-ns{float:none}.i-ns{font-style:italic}.fs-normal-ns{font-style:normal}.normal-ns{font-weight:400}.b-ns{font-weight:700}.fw1-ns{font-weight:100}.fw2-ns{font-weight:200}.fw3-ns{font-weight:300}.fw4-ns{font-weight:400}.fw5-ns{font-weight:500}.fw6-ns{font-weight:600}.fw7-ns{font-weight:700}.fw8-ns{font-weight:800}.fw9-ns{font-weight:900}.h1-ns{height:1rem}.h2-ns{height:2rem}.h3-ns{height:4rem}.h4-ns{height:8rem}.h5-ns{height:16rem}.h-25-ns{height:25%}.h-50-ns{height:50%}.h-75-ns{height:75%}.h-100-ns{height:100%}.min-h-100-ns{min-height:100%}.vh-25-ns{height:25vh}.vh-50-ns{height:50vh}.vh-75-ns{height:75vh}.vh-100-ns{height:100vh}.min-vh-100-ns{min-height:100vh}.h-auto-ns{height:auto}.h-inherit-ns{height:inherit}.tracked-ns{letter-spacing:.1em}.tracked-tight-ns{letter-spacing:-.05em}.tracked-mega-ns{letter-spacing:.25em}.lh-solid-ns{line-height:1}.lh-title-ns{line-height:1.25}.lh-copy-ns{line-height:1.5}.mw-100-ns{max-width:100%}.mw1-ns{max-width:1rem}.mw2-ns{max-width:2rem}.mw3-ns{max-width:4rem}.mw4-ns{max-width:8rem}.mw5-ns{max-width:16rem}.mw6-ns{max-width:32rem}.mw7-ns{max-width:48rem}.mw8-ns{max-width:64rem}.mw9-ns{max-width:96rem}.mw-none-ns{max-width:none}.w1-ns{width:1rem}.w2-ns{width:2rem}.w3-ns{width:4rem}.w4-ns{width:8rem}.w5-ns{width:16rem}.w-10-ns{width:10%}.w-20-ns{width:20%}.w-25-ns{width:25%}.w-30-ns{width:30%}.w-33-ns{width:33%}.w-34-ns{width:34%}.w-40-ns{width:40%}.w-50-ns{width:50%}.w-60-ns{width:60%}.w-70-ns{width:70%}.w-75-ns{width:75%}.w-80-ns{width:80%}.w-90-ns{width:90%}.w-100-ns{width:100%}.w-third-ns{width:33.33333%}.w-two-thirds-ns{width:66.66667%}.w-auto-ns{width:auto}.overflow-visible-ns{overflow:visible}.overflow-hidden-ns{overflow:hidden}.overflow-scroll-ns{overflow:scroll}.overflow-auto-ns{overflow:auto}.overflow-x-visible-ns{overflow-x:visible}.overflow-x-hidden-ns{overflow-x:hidden}.overflow-x-scroll-ns{overflow-x:scroll}.overflow-x-auto-ns{overflow-x:auto}.overflow-y-visible-ns{overflow-y:visible}.overflow-y-hidden-ns{overflow-y:hidden}.overflow-y-scroll-ns{overflow-y:scroll}.overflow-y-auto-ns{overflow-y:auto}.static-ns{position:static}.relative-ns{position:relative}.absolute-ns{position:absolute}.fixed-ns{position:fixed}.rotate-45-ns{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.rotate-90-ns{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.rotate-135-ns{-webkit-transform:rotate(135deg);transform:rotate(135deg)}.rotate-180-ns{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.rotate-225-ns{-webkit-transform:rotate(225deg);transform:rotate(225deg)}.rotate-270-ns{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.rotate-315-ns{-webkit-transform:rotate(315deg);transform:rotate(315deg)}.pa0-ns{padding:0}.pa1-ns{padding:.25rem}.pa2-ns{padding:.5rem}.pa3-ns{padding:1rem}.pa4-ns{padding:2rem}.pa5-ns{padding:4rem}.pa6-ns{padding:8rem}.pa7-ns{padding:16rem}.pl0-ns{padding-left:0}.pl1-ns{padding-left:.25rem}.pl2-ns{padding-left:.5rem}.pl3-ns{padding-left:1rem}.pl4-ns{padding-left:2rem}.pl5-ns{padding-left:4rem}.pl6-ns{padding-left:8rem}.pl7-ns{padding-left:16rem}.pr0-ns{padding-right:0}.pr1-ns{padding-right:.25rem}.pr2-ns{padding-right:.5rem}.pr3-ns{padding-right:1rem}.pr4-ns{padding-right:2rem}.pr5-ns{padding-right:4rem}.pr6-ns{padding-right:8rem}.pr7-ns{padding-right:16rem}.pb0-ns{padding-bottom:0}.pb1-ns{padding-bottom:.25rem}.pb2-ns{padding-bottom:.5rem}.pb3-ns{padding-bottom:1rem}.pb4-ns{padding-bottom:2rem}.pb5-ns{padding-bottom:4rem}.pb6-ns{padding-bottom:8rem}.pb7-ns{padding-bottom:16rem}.pt0-ns{padding-top:0}.pt1-ns{padding-top:.25rem}.pt2-ns{padding-top:.5rem}.pt3-ns{padding-top:1rem}.pt4-ns{padding-top:2rem}.pt5-ns{padding-top:4rem}.pt6-ns{padding-top:8rem}.pt7-ns{padding-top:16rem}.pv0-ns{padding-top:0;padding-bottom:0}.pv1-ns{padding-top:.25rem;padding-bottom:.25rem}.pv2-ns{padding-top:.5rem;padding-bottom:.5rem}.pv3-ns{padding-top:1rem;padding-bottom:1rem}.pv4-ns{padding-top:2rem;padding-bottom:2rem}.pv5-ns{padding-top:4rem;padding-bottom:4rem}.pv6-ns{padding-top:8rem;padding-bottom:8rem}.pv7-ns{padding-top:16rem;padding-bottom:16rem}.ph0-ns{padding-left:0;padding-right:0}.ph1-ns{padding-left:.25rem;padding-right:.25rem}.ph2-ns{padding-left:.5rem;padding-right:.5rem}.ph3-ns{padding-left:1rem;padding-right:1rem}.ph4-ns{padding-left:2rem;padding-right:2rem}.ph5-ns{padding-left:4rem;padding-right:4rem}.ph6-ns{padding-left:8rem;padding-right:8rem}.ph7-ns{padding-left:16rem;padding-right:16rem}.ma0-ns{margin:0}.ma1-ns{margin:.25rem}.ma2-ns{margin:.5rem}.ma3-ns{margin:1rem}.ma4-ns{margin:2rem}.ma5-ns{margin:4rem}.ma6-ns{margin:8rem}.ma7-ns{margin:16rem}.ml0-ns{margin-left:0}.ml1-ns{margin-left:.25rem}.ml2-ns{margin-left:.5rem}.ml3-ns{margin-left:1rem}.ml4-ns{margin-left:2rem}.ml5-ns{margin-left:4rem}.ml6-ns{margin-left:8rem}.ml7-ns{margin-left:16rem}.mr0-ns{margin-right:0}.mr1-ns{margin-right:.25rem}.mr2-ns{margin-right:.5rem}.mr3-ns{margin-right:1rem}.mr4-ns{margin-right:2rem}.mr5-ns{margin-right:4rem}.mr6-ns{margin-right:8rem}.mr7-ns{margin-right:16rem}.mb0-ns{margin-bottom:0}.mb1-ns{margin-bottom:.25rem}.mb2-ns{margin-bottom:.5rem}.mb3-ns{margin-bottom:1rem}.mb4-ns{margin-bottom:2rem}.mb5-ns{margin-bottom:4rem}.mb6-ns{margin-bottom:8rem}.mb7-ns{margin-bottom:16rem}.mt0-ns{margin-top:0}.mt1-ns{margin-top:.25rem}.mt2-ns{margin-top:.5rem}.mt3-ns{margin-top:1rem}.mt4-ns{margin-top:2rem}.mt5-ns{margin-top:4rem}.mt6-ns{margin-top:8rem}.mt7-ns{margin-top:16rem}.mv0-ns{margin-top:0;margin-bottom:0}.mv1-ns{margin-top:.25rem;margin-bottom:.25rem}.mv2-ns{margin-top:.5rem;margin-bottom:.5rem}.mv3-ns{margin-top:1rem;margin-bottom:1rem}.mv4-ns{margin-top:2rem;margin-bottom:2rem}.mv5-ns{margin-top:4rem;margin-bottom:4rem}.mv6-ns{margin-top:8rem;margin-bottom:8rem}.mv7-ns{margin-top:16rem;margin-bottom:16rem}.mh0-ns{margin-left:0;margin-right:0}.mh1-ns{margin-left:.25rem;margin-right:.25rem}.mh2-ns{margin-left:.5rem;margin-right:.5rem}.mh3-ns{margin-left:1rem;margin-right:1rem}.mh4-ns{margin-left:2rem;margin-right:2rem}.mh5-ns{margin-left:4rem;margin-right:4rem}.mh6-ns{margin-left:8rem;margin-right:8rem}.mh7-ns{margin-left:16rem;margin-right:16rem}.na1-ns{margin:-.25rem}.na2-ns{margin:-.5rem}.na3-ns{margin:-1rem}.na4-ns{margin:-2rem}.na5-ns{margin:-4rem}.na6-ns{margin:-8rem}.na7-ns{margin:-16rem}.nl1-ns{margin-left:-.25rem}.nl2-ns{margin-left:-.5rem}.nl3-ns{margin-left:-1rem}.nl4-ns{margin-left:-2rem}.nl5-ns{margin-left:-4rem}.nl6-ns{margin-left:-8rem}.nl7-ns{margin-left:-16rem}.nr1-ns{margin-right:-.25rem}.nr2-ns{margin-right:-.5rem}.nr3-ns{margin-right:-1rem}.nr4-ns{margin-right:-2rem}.nr5-ns{margin-right:-4rem}.nr6-ns{margin-right:-8rem}.nr7-ns{margin-right:-16rem}.nb1-ns{margin-bottom:-.25rem}.nb2-ns{margin-bottom:-.5rem}.nb3-ns{margin-bottom:-1rem}.nb4-ns{margin-bottom:-2rem}.nb5-ns{margin-bottom:-4rem}.nb6-ns{margin-bottom:-8rem}.nb7-ns{margin-bottom:-16rem}.nt1-ns{margin-top:-.25rem}.nt2-ns{margin-top:-.5rem}.nt3-ns{margin-top:-1rem}.nt4-ns{margin-top:-2rem}.nt5-ns{margin-top:-4rem}.nt6-ns{margin-top:-8rem}.nt7-ns{margin-top:-16rem}.strike-ns{text-decoration:line-through}.underline-ns{text-decoration:underline}.no-underline-ns{text-decoration:none}.tl-ns{text-align:left}.tr-ns{text-align:right}.tc-ns{text-align:center}.tj-ns{text-align:justify}.ttc-ns{text-transform:capitalize}.ttl-ns{text-transform:lowercase}.ttu-ns{text-transform:uppercase}.ttn-ns{text-transform:none}.f-6-ns,.f-headline-ns{font-size:6rem}.f-5-ns,.f-subheadline-ns{font-size:5rem}.f1-ns{font-size:3rem}.f2-ns{font-size:2.25rem}.f3-ns{font-size:1.5rem}.f4-ns{font-size:1.25rem}.f5-ns{font-size:1rem}.f6-ns{font-size:.875rem}.f7-ns{font-size:.75rem}.measure-ns{max-width:30em}.measure-wide-ns{max-width:34em}.measure-narrow-ns{max-width:20em}.indent-ns{text-indent:1em;margin-top:0;margin-bottom:0}.small-caps-ns{font-variant:small-caps}.truncate-ns{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.center-ns{margin-left:auto}.center-ns,.mr-auto-ns{margin-right:auto}.ml-auto-ns{margin-left:auto}.clip-ns{position:fixed!important;position:absolute!important;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px)}.ws-normal-ns{white-space:normal}.nowrap-ns{white-space:nowrap}.pre-ns{white-space:pre}.v-base-ns{vertical-align:baseline}.v-mid-ns{vertical-align:middle}.v-top-ns{vertical-align:top}.v-btm-ns{vertical-align:bottom}}@media screen and (min-width:30em) and (max-width:60em){.aspect-ratio-m{height:0;position:relative}.aspect-ratio--16x9-m{padding-bottom:56.25%}.aspect-ratio--9x16-m{padding-bottom:177.77%}.aspect-ratio--4x3-m{padding-bottom:75%}.aspect-ratio--3x4-m{padding-bottom:133.33%}.aspect-ratio--6x4-m{padding-bottom:66.6%}.aspect-ratio--4x6-m{padding-bottom:150%}.aspect-ratio--8x5-m{padding-bottom:62.5%}.aspect-ratio--5x8-m{padding-bottom:160%}.aspect-ratio--7x5-m{padding-bottom:71.42%}.aspect-ratio--5x7-m{padding-bottom:140%}.aspect-ratio--1x1-m{padding-bottom:100%}.aspect-ratio--object-m{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;z-index:100}.cover-m{background-size:cover!important}.contain-m{background-size:contain!important}.bg-center-m{background-position:50%}.bg-center-m,.bg-top-m{background-repeat:no-repeat}.bg-top-m{background-position:top}.bg-right-m{background-position:100%}.bg-bottom-m,.bg-right-m{background-repeat:no-repeat}.bg-bottom-m{background-position:bottom}.bg-left-m{background-repeat:no-repeat;background-position:0}.outline-m{outline:1px solid}.outline-transparent-m{outline:1px solid transparent}.outline-0-m{outline:0}.ba-m{border-style:solid;border-width:1px}.bt-m{border-top-style:solid;border-top-width:1px}.br-m{border-right-style:solid;border-right-width:1px}.bb-m{border-bottom-style:solid;border-bottom-width:1px}.bl-m{border-left-style:solid;border-left-width:1px}.bn-m{border-style:none;border-width:0}.br0-m{border-radius:0}.br1-m{border-radius:.125rem}.br2-m{border-radius:.25rem}.br3-m{border-radius:.5rem}.br4-m{border-radius:1rem}.br-100-m{border-radius:100%}.br-pill-m{border-radius:9999px}.br--bottom-m{border-top-left-radius:0;border-top-right-radius:0}.br--top-m{border-bottom-right-radius:0}.br--right-m,.br--top-m{border-bottom-left-radius:0}.br--right-m{border-top-left-radius:0}.br--left-m{border-top-right-radius:0;border-bottom-right-radius:0}.b--dotted-m{border-style:dotted}.b--dashed-m{border-style:dashed}.b--solid-m{border-style:solid}.b--none-m{border-style:none}.bw0-m{border-width:0}.bw1-m{border-width:.125rem}.bw2-m{border-width:.25rem}.bw3-m{border-width:.5rem}.bw4-m{border-width:1rem}.bw5-m{border-width:2rem}.bt-0-m{border-top-width:0}.br-0-m{border-right-width:0}.bb-0-m{border-bottom-width:0}.bl-0-m{border-left-width:0}.shadow-1-m{box-shadow:0 0 4px 2px rgba(0,0,0,.2)}.shadow-2-m{box-shadow:0 0 8px 2px rgba(0,0,0,.2)}.shadow-3-m{box-shadow:2px 2px 4px 2px rgba(0,0,0,.2)}.shadow-4-m{box-shadow:2px 2px 8px 0 rgba(0,0,0,.2)}.shadow-5-m{box-shadow:4px 4px 8px 0 rgba(0,0,0,.2)}.top-0-m{top:0}.left-0-m{left:0}.right-0-m{right:0}.bottom-0-m{bottom:0}.top-1-m{top:1rem}.left-1-m{left:1rem}.right-1-m{right:1rem}.bottom-1-m{bottom:1rem}.top-2-m{top:2rem}.left-2-m{left:2rem}.right-2-m{right:2rem}.bottom-2-m{bottom:2rem}.top--1-m{top:-1rem}.right--1-m{right:-1rem}.bottom--1-m{bottom:-1rem}.left--1-m{left:-1rem}.top--2-m{top:-2rem}.right--2-m{right:-2rem}.bottom--2-m{bottom:-2rem}.left--2-m{left:-2rem}.absolute--fill-m{top:0;right:0;bottom:0;left:0}.cl-m{clear:left}.cr-m{clear:right}.cb-m{clear:both}.cn-m{clear:none}.dn-m{display:none}.di-m{display:inline}.db-m{display:block}.dib-m{display:inline-block}.dit-m{display:inline-table}.dt-m{display:table}.dtc-m{display:table-cell}.dt-row-m{display:table-row}.dt-row-group-m{display:table-row-group}.dt-column-m{display:table-column}.dt-column-group-m{display:table-column-group}.dt--fixed-m{table-layout:fixed;width:100%}.flex-m{display:-webkit-box;display:-ms-flexbox;display:flex}.inline-flex-m{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.flex-auto-m{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;min-width:0;min-height:0}.flex-none-m{-webkit-box-flex:0;-ms-flex:none;flex:none}.flex-column-m{-webkit-box-orient:vertical;-ms-flex-direction:column;flex-direction:column}.flex-column-m,.flex-row-m{-webkit-box-direction:normal}.flex-row-m{-webkit-box-orient:horizontal;-ms-flex-direction:row;flex-direction:row}.flex-wrap-m{-ms-flex-wrap:wrap;flex-wrap:wrap}.flex-nowrap-m{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.flex-wrap-reverse-m{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.flex-column-reverse-m{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.flex-row-reverse-m{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.items-start-m{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.items-end-m{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.items-center-m{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.items-baseline-m{-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline}.items-stretch-m{-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.self-start-m{-ms-flex-item-align:start;align-self:flex-start}.self-end-m{-ms-flex-item-align:end;align-self:flex-end}.self-center-m{-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.self-baseline-m{-ms-flex-item-align:baseline;align-self:baseline}.self-stretch-m{-ms-flex-item-align:stretch;-ms-grid-row-align:stretch;align-self:stretch}.justify-start-m{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.justify-end-m{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.justify-center-m{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.justify-between-m{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.justify-around-m{-ms-flex-pack:distribute;justify-content:space-around}.content-start-m{-ms-flex-line-pack:start;align-content:flex-start}.content-end-m{-ms-flex-line-pack:end;align-content:flex-end}.content-center-m{-ms-flex-line-pack:center;align-content:center}.content-between-m{-ms-flex-line-pack:justify;align-content:space-between}.content-around-m{-ms-flex-line-pack:distribute;align-content:space-around}.content-stretch-m{-ms-flex-line-pack:stretch;align-content:stretch}.order-0-m{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-1-m{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-2-m{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-3-m{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-4-m{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-5-m{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-6-m{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-7-m{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-8-m{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-last-m{-webkit-box-ordinal-group:100000;-ms-flex-order:99999;order:99999}.flex-grow-0-m{-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0}.flex-grow-1-m{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1}.flex-shrink-0-m{-ms-flex-negative:0;flex-shrink:0}.flex-shrink-1-m{-ms-flex-negative:1;flex-shrink:1}.fl-m{float:left}.fl-m,.fr-m{display:inline}.fr-m{float:right}.fn-m{float:none}.i-m{font-style:italic}.fs-normal-m{font-style:normal}.normal-m{font-weight:400}.b-m{font-weight:700}.fw1-m{font-weight:100}.fw2-m{font-weight:200}.fw3-m{font-weight:300}.fw4-m{font-weight:400}.fw5-m{font-weight:500}.fw6-m{font-weight:600}.fw7-m{font-weight:700}.fw8-m{font-weight:800}.fw9-m{font-weight:900}.h1-m{height:1rem}.h2-m{height:2rem}.h3-m{height:4rem}.h4-m{height:8rem}.h5-m{height:16rem}.h-25-m{height:25%}.h-50-m{height:50%}.h-75-m{height:75%}.h-100-m{height:100%}.min-h-100-m{min-height:100%}.vh-25-m{height:25vh}.vh-50-m{height:50vh}.vh-75-m{height:75vh}.vh-100-m{height:100vh}.min-vh-100-m{min-height:100vh}.h-auto-m{height:auto}.h-inherit-m{height:inherit}.tracked-m{letter-spacing:.1em}.tracked-tight-m{letter-spacing:-.05em}.tracked-mega-m{letter-spacing:.25em}.lh-solid-m{line-height:1}.lh-title-m{line-height:1.25}.lh-copy-m{line-height:1.5}.mw-100-m{max-width:100%}.mw1-m{max-width:1rem}.mw2-m{max-width:2rem}.mw3-m{max-width:4rem}.mw4-m{max-width:8rem}.mw5-m{max-width:16rem}.mw6-m{max-width:32rem}.mw7-m{max-width:48rem}.mw8-m{max-width:64rem}.mw9-m{max-width:96rem}.mw-none-m{max-width:none}.w1-m{width:1rem}.w2-m{width:2rem}.w3-m{width:4rem}.w4-m{width:8rem}.w5-m{width:16rem}.w-10-m{width:10%}.w-20-m{width:20%}.w-25-m{width:25%}.w-30-m{width:30%}.w-33-m{width:33%}.w-34-m{width:34%}.w-40-m{width:40%}.w-50-m{width:50%}.w-60-m{width:60%}.w-70-m{width:70%}.w-75-m{width:75%}.w-80-m{width:80%}.w-90-m{width:90%}.w-100-m{width:100%}.w-third-m{width:33.33333%}.w-two-thirds-m{width:66.66667%}.w-auto-m{width:auto}.overflow-visible-m{overflow:visible}.overflow-hidden-m{overflow:hidden}.overflow-scroll-m{overflow:scroll}.overflow-auto-m{overflow:auto}.overflow-x-visible-m{overflow-x:visible}.overflow-x-hidden-m{overflow-x:hidden}.overflow-x-scroll-m{overflow-x:scroll}.overflow-x-auto-m{overflow-x:auto}.overflow-y-visible-m{overflow-y:visible}.overflow-y-hidden-m{overflow-y:hidden}.overflow-y-scroll-m{overflow-y:scroll}.overflow-y-auto-m{overflow-y:auto}.static-m{position:static}.relative-m{position:relative}.absolute-m{position:absolute}.fixed-m{position:fixed}.rotate-45-m{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.rotate-90-m{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.rotate-135-m{-webkit-transform:rotate(135deg);transform:rotate(135deg)}.rotate-180-m{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.rotate-225-m{-webkit-transform:rotate(225deg);transform:rotate(225deg)}.rotate-270-m{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.rotate-315-m{-webkit-transform:rotate(315deg);transform:rotate(315deg)}.pa0-m{padding:0}.pa1-m{padding:.25rem}.pa2-m{padding:.5rem}.pa3-m{padding:1rem}.pa4-m{padding:2rem}.pa5-m{padding:4rem}.pa6-m{padding:8rem}.pa7-m{padding:16rem}.pl0-m{padding-left:0}.pl1-m{padding-left:.25rem}.pl2-m{padding-left:.5rem}.pl3-m{padding-left:1rem}.pl4-m{padding-left:2rem}.pl5-m{padding-left:4rem}.pl6-m{padding-left:8rem}.pl7-m{padding-left:16rem}.pr0-m{padding-right:0}.pr1-m{padding-right:.25rem}.pr2-m{padding-right:.5rem}.pr3-m{padding-right:1rem}.pr4-m{padding-right:2rem}.pr5-m{padding-right:4rem}.pr6-m{padding-right:8rem}.pr7-m{padding-right:16rem}.pb0-m{padding-bottom:0}.pb1-m{padding-bottom:.25rem}.pb2-m{padding-bottom:.5rem}.pb3-m{padding-bottom:1rem}.pb4-m{padding-bottom:2rem}.pb5-m{padding-bottom:4rem}.pb6-m{padding-bottom:8rem}.pb7-m{padding-bottom:16rem}.pt0-m{padding-top:0}.pt1-m{padding-top:.25rem}.pt2-m{padding-top:.5rem}.pt3-m{padding-top:1rem}.pt4-m{padding-top:2rem}.pt5-m{padding-top:4rem}.pt6-m{padding-top:8rem}.pt7-m{padding-top:16rem}.pv0-m{padding-top:0;padding-bottom:0}.pv1-m{padding-top:.25rem;padding-bottom:.25rem}.pv2-m{padding-top:.5rem;padding-bottom:.5rem}.pv3-m{padding-top:1rem;padding-bottom:1rem}.pv4-m{padding-top:2rem;padding-bottom:2rem}.pv5-m{padding-top:4rem;padding-bottom:4rem}.pv6-m{padding-top:8rem;padding-bottom:8rem}.pv7-m{padding-top:16rem;padding-bottom:16rem}.ph0-m{padding-left:0;padding-right:0}.ph1-m{padding-left:.25rem;padding-right:.25rem}.ph2-m{padding-left:.5rem;padding-right:.5rem}.ph3-m{padding-left:1rem;padding-right:1rem}.ph4-m{padding-left:2rem;padding-right:2rem}.ph5-m{padding-left:4rem;padding-right:4rem}.ph6-m{padding-left:8rem;padding-right:8rem}.ph7-m{padding-left:16rem;padding-right:16rem}.ma0-m{margin:0}.ma1-m{margin:.25rem}.ma2-m{margin:.5rem}.ma3-m{margin:1rem}.ma4-m{margin:2rem}.ma5-m{margin:4rem}.ma6-m{margin:8rem}.ma7-m{margin:16rem}.ml0-m{margin-left:0}.ml1-m{margin-left:.25rem}.ml2-m{margin-left:.5rem}.ml3-m{margin-left:1rem}.ml4-m{margin-left:2rem}.ml5-m{margin-left:4rem}.ml6-m{margin-left:8rem}.ml7-m{margin-left:16rem}.mr0-m{margin-right:0}.mr1-m{margin-right:.25rem}.mr2-m{margin-right:.5rem}.mr3-m{margin-right:1rem}.mr4-m{margin-right:2rem}.mr5-m{margin-right:4rem}.mr6-m{margin-right:8rem}.mr7-m{margin-right:16rem}.mb0-m{margin-bottom:0}.mb1-m{margin-bottom:.25rem}.mb2-m{margin-bottom:.5rem}.mb3-m{margin-bottom:1rem}.mb4-m{margin-bottom:2rem}.mb5-m{margin-bottom:4rem}.mb6-m{margin-bottom:8rem}.mb7-m{margin-bottom:16rem}.mt0-m{margin-top:0}.mt1-m{margin-top:.25rem}.mt2-m{margin-top:.5rem}.mt3-m{margin-top:1rem}.mt4-m{margin-top:2rem}.mt5-m{margin-top:4rem}.mt6-m{margin-top:8rem}.mt7-m{margin-top:16rem}.mv0-m{margin-top:0;margin-bottom:0}.mv1-m{margin-top:.25rem;margin-bottom:.25rem}.mv2-m{margin-top:.5rem;margin-bottom:.5rem}.mv3-m{margin-top:1rem;margin-bottom:1rem}.mv4-m{margin-top:2rem;margin-bottom:2rem}.mv5-m{margin-top:4rem;margin-bottom:4rem}.mv6-m{margin-top:8rem;margin-bottom:8rem}.mv7-m{margin-top:16rem;margin-bottom:16rem}.mh0-m{margin-left:0;margin-right:0}.mh1-m{margin-left:.25rem;margin-right:.25rem}.mh2-m{margin-left:.5rem;margin-right:.5rem}.mh3-m{margin-left:1rem;margin-right:1rem}.mh4-m{margin-left:2rem;margin-right:2rem}.mh5-m{margin-left:4rem;margin-right:4rem}.mh6-m{margin-left:8rem;margin-right:8rem}.mh7-m{margin-left:16rem;margin-right:16rem}.na1-m{margin:-.25rem}.na2-m{margin:-.5rem}.na3-m{margin:-1rem}.na4-m{margin:-2rem}.na5-m{margin:-4rem}.na6-m{margin:-8rem}.na7-m{margin:-16rem}.nl1-m{margin-left:-.25rem}.nl2-m{margin-left:-.5rem}.nl3-m{margin-left:-1rem}.nl4-m{margin-left:-2rem}.nl5-m{margin-left:-4rem}.nl6-m{margin-left:-8rem}.nl7-m{margin-left:-16rem}.nr1-m{margin-right:-.25rem}.nr2-m{margin-right:-.5rem}.nr3-m{margin-right:-1rem}.nr4-m{margin-right:-2rem}.nr5-m{margin-right:-4rem}.nr6-m{margin-right:-8rem}.nr7-m{margin-right:-16rem}.nb1-m{margin-bottom:-.25rem}.nb2-m{margin-bottom:-.5rem}.nb3-m{margin-bottom:-1rem}.nb4-m{margin-bottom:-2rem}.nb5-m{margin-bottom:-4rem}.nb6-m{margin-bottom:-8rem}.nb7-m{margin-bottom:-16rem}.nt1-m{margin-top:-.25rem}.nt2-m{margin-top:-.5rem}.nt3-m{margin-top:-1rem}.nt4-m{margin-top:-2rem}.nt5-m{margin-top:-4rem}.nt6-m{margin-top:-8rem}.nt7-m{margin-top:-16rem}.strike-m{text-decoration:line-through}.underline-m{text-decoration:underline}.no-underline-m{text-decoration:none}.tl-m{text-align:left}.tr-m{text-align:right}.tc-m{text-align:center}.tj-m{text-align:justify}.ttc-m{text-transform:capitalize}.ttl-m{text-transform:lowercase}.ttu-m{text-transform:uppercase}.ttn-m{text-transform:none}.f-6-m,.f-headline-m{font-size:6rem}.f-5-m,.f-subheadline-m{font-size:5rem}.f1-m{font-size:3rem}.f2-m{font-size:2.25rem}.f3-m{font-size:1.5rem}.f4-m{font-size:1.25rem}.f5-m{font-size:1rem}.f6-m{font-size:.875rem}.f7-m{font-size:.75rem}.measure-m{max-width:30em}.measure-wide-m{max-width:34em}.measure-narrow-m{max-width:20em}.indent-m{text-indent:1em;margin-top:0;margin-bottom:0}.small-caps-m{font-variant:small-caps}.truncate-m{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.center-m{margin-left:auto}.center-m,.mr-auto-m{margin-right:auto}.ml-auto-m{margin-left:auto}.clip-m{position:fixed!important;position:absolute!important;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px)}.ws-normal-m{white-space:normal}.nowrap-m{white-space:nowrap}.pre-m{white-space:pre}.v-base-m{vertical-align:baseline}.v-mid-m{vertical-align:middle}.v-top-m{vertical-align:top}.v-btm-m{vertical-align:bottom}}@media screen and (min-width:60em){.aspect-ratio-l{height:0;position:relative}.aspect-ratio--16x9-l{padding-bottom:56.25%}.aspect-ratio--9x16-l{padding-bottom:177.77%}.aspect-ratio--4x3-l{padding-bottom:75%}.aspect-ratio--3x4-l{padding-bottom:133.33%}.aspect-ratio--6x4-l{padding-bottom:66.6%}.aspect-ratio--4x6-l{padding-bottom:150%}.aspect-ratio--8x5-l{padding-bottom:62.5%}.aspect-ratio--5x8-l{padding-bottom:160%}.aspect-ratio--7x5-l{padding-bottom:71.42%}.aspect-ratio--5x7-l{padding-bottom:140%}.aspect-ratio--1x1-l{padding-bottom:100%}.aspect-ratio--object-l{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;z-index:100}.cover-l{background-size:cover!important}.contain-l{background-size:contain!important}.bg-center-l{background-position:50%}.bg-center-l,.bg-top-l{background-repeat:no-repeat}.bg-top-l{background-position:top}.bg-right-l{background-position:100%}.bg-bottom-l,.bg-right-l{background-repeat:no-repeat}.bg-bottom-l{background-position:bottom}.bg-left-l{background-repeat:no-repeat;background-position:0}.outline-l{outline:1px solid}.outline-transparent-l{outline:1px solid transparent}.outline-0-l{outline:0}.ba-l{border-style:solid;border-width:1px}.bt-l{border-top-style:solid;border-top-width:1px}.br-l{border-right-style:solid;border-right-width:1px}.bb-l{border-bottom-style:solid;border-bottom-width:1px}.bl-l{border-left-style:solid;border-left-width:1px}.bn-l{border-style:none;border-width:0}.br0-l{border-radius:0}.br1-l{border-radius:.125rem}.br2-l{border-radius:.25rem}.br3-l{border-radius:.5rem}.br4-l{border-radius:1rem}.br-100-l{border-radius:100%}.br-pill-l{border-radius:9999px}.br--bottom-l{border-top-left-radius:0;border-top-right-radius:0}.br--top-l{border-bottom-right-radius:0}.br--right-l,.br--top-l{border-bottom-left-radius:0}.br--right-l{border-top-left-radius:0}.br--left-l{border-top-right-radius:0;border-bottom-right-radius:0}.b--dotted-l{border-style:dotted}.b--dashed-l{border-style:dashed}.b--solid-l{border-style:solid}.b--none-l{border-style:none}.bw0-l{border-width:0}.bw1-l{border-width:.125rem}.bw2-l{border-width:.25rem}.bw3-l{border-width:.5rem}.bw4-l{border-width:1rem}.bw5-l{border-width:2rem}.bt-0-l{border-top-width:0}.br-0-l{border-right-width:0}.bb-0-l{border-bottom-width:0}.bl-0-l{border-left-width:0}.shadow-1-l{box-shadow:0 0 4px 2px rgba(0,0,0,.2)}.shadow-2-l{box-shadow:0 0 8px 2px rgba(0,0,0,.2)}.shadow-3-l{box-shadow:2px 2px 4px 2px rgba(0,0,0,.2)}.shadow-4-l{box-shadow:2px 2px 8px 0 rgba(0,0,0,.2)}.shadow-5-l{box-shadow:4px 4px 8px 0 rgba(0,0,0,.2)}.top-0-l{top:0}.left-0-l{left:0}.right-0-l{right:0}.bottom-0-l{bottom:0}.top-1-l{top:1rem}.left-1-l{left:1rem}.right-1-l{right:1rem}.bottom-1-l{bottom:1rem}.top-2-l{top:2rem}.left-2-l{left:2rem}.right-2-l{right:2rem}.bottom-2-l{bottom:2rem}.top--1-l{top:-1rem}.right--1-l{right:-1rem}.bottom--1-l{bottom:-1rem}.left--1-l{left:-1rem}.top--2-l{top:-2rem}.right--2-l{right:-2rem}.bottom--2-l{bottom:-2rem}.left--2-l{left:-2rem}.absolute--fill-l{top:0;right:0;bottom:0;left:0}.cl-l{clear:left}.cr-l{clear:right}.cb-l{clear:both}.cn-l{clear:none}.dn-l{display:none}.di-l{display:inline}.db-l{display:block}.dib-l{display:inline-block}.dit-l{display:inline-table}.dt-l{display:table}.dtc-l{display:table-cell}.dt-row-l{display:table-row}.dt-row-group-l{display:table-row-group}.dt-column-l{display:table-column}.dt-column-group-l{display:table-column-group}.dt--fixed-l{table-layout:fixed;width:100%}.flex-l{display:-webkit-box;display:-ms-flexbox;display:flex}.inline-flex-l{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.flex-auto-l{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;min-width:0;min-height:0}.flex-none-l{-webkit-box-flex:0;-ms-flex:none;flex:none}.flex-column-l{-webkit-box-orient:vertical;-ms-flex-direction:column;flex-direction:column}.flex-column-l,.flex-row-l{-webkit-box-direction:normal}.flex-row-l{-webkit-box-orient:horizontal;-ms-flex-direction:row;flex-direction:row}.flex-wrap-l{-ms-flex-wrap:wrap;flex-wrap:wrap}.flex-nowrap-l{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.flex-wrap-reverse-l{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.flex-column-reverse-l{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.flex-row-reverse-l{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.items-start-l{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.items-end-l{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.items-center-l{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.items-baseline-l{-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline}.items-stretch-l{-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.self-start-l{-ms-flex-item-align:start;align-self:flex-start}.self-end-l{-ms-flex-item-align:end;align-self:flex-end}.self-center-l{-ms-flex-item-align:center;-ms-grid-row-align:center;align-self:center}.self-baseline-l{-ms-flex-item-align:baseline;align-self:baseline}.self-stretch-l{-ms-flex-item-align:stretch;-ms-grid-row-align:stretch;align-self:stretch}.justify-start-l{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.justify-end-l{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.justify-center-l{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.justify-between-l{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.justify-around-l{-ms-flex-pack:distribute;justify-content:space-around}.content-start-l{-ms-flex-line-pack:start;align-content:flex-start}.content-end-l{-ms-flex-line-pack:end;align-content:flex-end}.content-center-l{-ms-flex-line-pack:center;align-content:center}.content-between-l{-ms-flex-line-pack:justify;align-content:space-between}.content-around-l{-ms-flex-line-pack:distribute;align-content:space-around}.content-stretch-l{-ms-flex-line-pack:stretch;align-content:stretch}.order-0-l{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.order-1-l{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.order-2-l{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.order-3-l{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.order-4-l{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.order-5-l{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.order-6-l{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.order-7-l{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.order-8-l{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.order-last-l{-webkit-box-ordinal-group:100000;-ms-flex-order:99999;order:99999}.flex-grow-0-l{-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0}.flex-grow-1-l{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1}.flex-shrink-0-l{-ms-flex-negative:0;flex-shrink:0}.flex-shrink-1-l{-ms-flex-negative:1;flex-shrink:1}.fl-l{float:left}.fl-l,.fr-l{display:inline}.fr-l{float:right}.fn-l{float:none}.i-l{font-style:italic}.fs-normal-l{font-style:normal}.normal-l{font-weight:400}.b-l{font-weight:700}.fw1-l{font-weight:100}.fw2-l{font-weight:200}.fw3-l{font-weight:300}.fw4-l{font-weight:400}.fw5-l{font-weight:500}.fw6-l{font-weight:600}.fw7-l{font-weight:700}.fw8-l{font-weight:800}.fw9-l{font-weight:900}.h1-l{height:1rem}.h2-l{height:2rem}.h3-l{height:4rem}.h4-l{height:8rem}.h5-l{height:16rem}.h-25-l{height:25%}.h-50-l{height:50%}.h-75-l{height:75%}.h-100-l{height:100%}.min-h-100-l{min-height:100%}.vh-25-l{height:25vh}.vh-50-l{height:50vh}.vh-75-l{height:75vh}.vh-100-l{height:100vh}.min-vh-100-l{min-height:100vh}.h-auto-l{height:auto}.h-inherit-l{height:inherit}.tracked-l{letter-spacing:.1em}.tracked-tight-l{letter-spacing:-.05em}.tracked-mega-l{letter-spacing:.25em}.lh-solid-l{line-height:1}.lh-title-l{line-height:1.25}.lh-copy-l{line-height:1.5}.mw-100-l{max-width:100%}.mw1-l{max-width:1rem}.mw2-l{max-width:2rem}.mw3-l{max-width:4rem}.mw4-l{max-width:8rem}.mw5-l{max-width:16rem}.mw6-l{max-width:32rem}.mw7-l{max-width:48rem}.mw8-l{max-width:64rem}.mw9-l{max-width:96rem}.mw-none-l{max-width:none}.w1-l{width:1rem}.w2-l{width:2rem}.w3-l{width:4rem}.w4-l{width:8rem}.w5-l{width:16rem}.w-10-l{width:10%}.w-20-l{width:20%}.w-25-l{width:25%}.w-30-l{width:30%}.w-33-l{width:33%}.w-34-l{width:34%}.w-40-l{width:40%}.w-50-l{width:50%}.w-60-l{width:60%}.w-70-l{width:70%}.w-75-l{width:75%}.w-80-l{width:80%}.w-90-l{width:90%}.w-100-l{width:100%}.w-third-l{width:33.33333%}.w-two-thirds-l{width:66.66667%}.w-auto-l{width:auto}.overflow-visible-l{overflow:visible}.overflow-hidden-l{overflow:hidden}.overflow-scroll-l{overflow:scroll}.overflow-auto-l{overflow:auto}.overflow-x-visible-l{overflow-x:visible}.overflow-x-hidden-l{overflow-x:hidden}.overflow-x-scroll-l{overflow-x:scroll}.overflow-x-auto-l{overflow-x:auto}.overflow-y-visible-l{overflow-y:visible}.overflow-y-hidden-l{overflow-y:hidden}.overflow-y-scroll-l{overflow-y:scroll}.overflow-y-auto-l{overflow-y:auto}.static-l{position:static}.relative-l{position:relative}.absolute-l{position:absolute}.fixed-l{position:fixed}.rotate-45-l{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.rotate-90-l{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.rotate-135-l{-webkit-transform:rotate(135deg);transform:rotate(135deg)}.rotate-180-l{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.rotate-225-l{-webkit-transform:rotate(225deg);transform:rotate(225deg)}.rotate-270-l{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.rotate-315-l{-webkit-transform:rotate(315deg);transform:rotate(315deg)}.pa0-l{padding:0}.pa1-l{padding:.25rem}.pa2-l{padding:.5rem}.pa3-l{padding:1rem}.pa4-l{padding:2rem}.pa5-l{padding:4rem}.pa6-l{padding:8rem}.pa7-l{padding:16rem}.pl0-l{padding-left:0}.pl1-l{padding-left:.25rem}.pl2-l{padding-left:.5rem}.pl3-l{padding-left:1rem}.pl4-l{padding-left:2rem}.pl5-l{padding-left:4rem}.pl6-l{padding-left:8rem}.pl7-l{padding-left:16rem}.pr0-l{padding-right:0}.pr1-l{padding-right:.25rem}.pr2-l{padding-right:.5rem}.pr3-l{padding-right:1rem}.pr4-l{padding-right:2rem}.pr5-l{padding-right:4rem}.pr6-l{padding-right:8rem}.pr7-l{padding-right:16rem}.pb0-l{padding-bottom:0}.pb1-l{padding-bottom:.25rem}.pb2-l{padding-bottom:.5rem}.pb3-l{padding-bottom:1rem}.pb4-l{padding-bottom:2rem}.pb5-l{padding-bottom:4rem}.pb6-l{padding-bottom:8rem}.pb7-l{padding-bottom:16rem}.pt0-l{padding-top:0}.pt1-l{padding-top:.25rem}.pt2-l{padding-top:.5rem}.pt3-l{padding-top:1rem}.pt4-l{padding-top:2rem}.pt5-l{padding-top:4rem}.pt6-l{padding-top:8rem}.pt7-l{padding-top:16rem}.pv0-l{padding-top:0;padding-bottom:0}.pv1-l{padding-top:.25rem;padding-bottom:.25rem}.pv2-l{padding-top:.5rem;padding-bottom:.5rem}.pv3-l{padding-top:1rem;padding-bottom:1rem}.pv4-l{padding-top:2rem;padding-bottom:2rem}.pv5-l{padding-top:4rem;padding-bottom:4rem}.pv6-l{padding-top:8rem;padding-bottom:8rem}.pv7-l{padding-top:16rem;padding-bottom:16rem}.ph0-l{padding-left:0;padding-right:0}.ph1-l{padding-left:.25rem;padding-right:.25rem}.ph2-l{padding-left:.5rem;padding-right:.5rem}.ph3-l{padding-left:1rem;padding-right:1rem}.ph4-l{padding-left:2rem;padding-right:2rem}.ph5-l{padding-left:4rem;padding-right:4rem}.ph6-l{padding-left:8rem;padding-right:8rem}.ph7-l{padding-left:16rem;padding-right:16rem}.ma0-l{margin:0}.ma1-l{margin:.25rem}.ma2-l{margin:.5rem}.ma3-l{margin:1rem}.ma4-l{margin:2rem}.ma5-l{margin:4rem}.ma6-l{margin:8rem}.ma7-l{margin:16rem}.ml0-l{margin-left:0}.ml1-l{margin-left:.25rem}.ml2-l{margin-left:.5rem}.ml3-l{margin-left:1rem}.ml4-l{margin-left:2rem}.ml5-l{margin-left:4rem}.ml6-l{margin-left:8rem}.ml7-l{margin-left:16rem}.mr0-l{margin-right:0}.mr1-l{margin-right:.25rem}.mr2-l{margin-right:.5rem}.mr3-l{margin-right:1rem}.mr4-l{margin-right:2rem}.mr5-l{margin-right:4rem}.mr6-l{margin-right:8rem}.mr7-l{margin-right:16rem}.mb0-l{margin-bottom:0}.mb1-l{margin-bottom:.25rem}.mb2-l{margin-bottom:.5rem}.mb3-l{margin-bottom:1rem}.mb4-l{margin-bottom:2rem}.mb5-l{margin-bottom:4rem}.mb6-l{margin-bottom:8rem}.mb7-l{margin-bottom:16rem}.mt0-l{margin-top:0}.mt1-l{margin-top:.25rem}.mt2-l{margin-top:.5rem}.mt3-l{margin-top:1rem}.mt4-l{margin-top:2rem}.mt5-l{margin-top:4rem}.mt6-l{margin-top:8rem}.mt7-l{margin-top:16rem}.mv0-l{margin-top:0;margin-bottom:0}.mv1-l{margin-top:.25rem;margin-bottom:.25rem}.mv2-l{margin-top:.5rem;margin-bottom:.5rem}.mv3-l{margin-top:1rem;margin-bottom:1rem}.mv4-l{margin-top:2rem;margin-bottom:2rem}.mv5-l{margin-top:4rem;margin-bottom:4rem}.mv6-l{margin-top:8rem;margin-bottom:8rem}.mv7-l{margin-top:16rem;margin-bottom:16rem}.mh0-l{margin-left:0;margin-right:0}.mh1-l{margin-left:.25rem;margin-right:.25rem}.mh2-l{margin-left:.5rem;margin-right:.5rem}.mh3-l{margin-left:1rem;margin-right:1rem}.mh4-l{margin-left:2rem;margin-right:2rem}.mh5-l{margin-left:4rem;margin-right:4rem}.mh6-l{margin-left:8rem;margin-right:8rem}.mh7-l{margin-left:16rem;margin-right:16rem}.na1-l{margin:-.25rem}.na2-l{margin:-.5rem}.na3-l{margin:-1rem}.na4-l{margin:-2rem}.na5-l{margin:-4rem}.na6-l{margin:-8rem}.na7-l{margin:-16rem}.nl1-l{margin-left:-.25rem}.nl2-l{margin-left:-.5rem}.nl3-l{margin-left:-1rem}.nl4-l{margin-left:-2rem}.nl5-l{margin-left:-4rem}.nl6-l{margin-left:-8rem}.nl7-l{margin-left:-16rem}.nr1-l{margin-right:-.25rem}.nr2-l{margin-right:-.5rem}.nr3-l{margin-right:-1rem}.nr4-l{margin-right:-2rem}.nr5-l{margin-right:-4rem}.nr6-l{margin-right:-8rem}.nr7-l{margin-right:-16rem}.nb1-l{margin-bottom:-.25rem}.nb2-l{margin-bottom:-.5rem}.nb3-l{margin-bottom:-1rem}.nb4-l{margin-bottom:-2rem}.nb5-l{margin-bottom:-4rem}.nb6-l{margin-bottom:-8rem}.nb7-l{margin-bottom:-16rem}.nt1-l{margin-top:-.25rem}.nt2-l{margin-top:-.5rem}.nt3-l{margin-top:-1rem}.nt4-l{margin-top:-2rem}.nt5-l{margin-top:-4rem}.nt6-l{margin-top:-8rem}.nt7-l{margin-top:-16rem}.strike-l{text-decoration:line-through}.underline-l{text-decoration:underline}.no-underline-l{text-decoration:none}.tl-l{text-align:left}.tr-l{text-align:right}.tc-l{text-align:center}.tj-l{text-align:justify}.ttc-l{text-transform:capitalize}.ttl-l{text-transform:lowercase}.ttu-l{text-transform:uppercase}.ttn-l{text-transform:none}.f-6-l,.f-headline-l{font-size:6rem}.f-5-l,.f-subheadline-l{font-size:5rem}.f1-l{font-size:3rem}.f2-l{font-size:2.25rem}.f3-l{font-size:1.5rem}.f4-l{font-size:1.25rem}.f5-l{font-size:1rem}.f6-l{font-size:.875rem}.f7-l{font-size:.75rem}.measure-l{max-width:30em}.measure-wide-l{max-width:34em}.measure-narrow-l{max-width:20em}.indent-l{text-indent:1em;margin-top:0;margin-bottom:0}.small-caps-l{font-variant:small-caps}.truncate-l{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.center-l{margin-left:auto}.center-l,.mr-auto-l{margin-right:auto}.ml-auto-l{margin-left:auto}.clip-l{position:fixed!important;position:absolute!important;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px)}.ws-normal-l{white-space:normal}.nowrap-l{white-space:nowrap}.pre-l{white-space:pre}.v-base-l{vertical-align:baseline}.v-mid-l{vertical-align:middle}.v-top-l{vertical-align:top}.v-btm-l{vertical-align:bottom}}") || true) && "_d0ba6289")
;((require('sheetify/insert')("* {\n  user-select: none !important;\n}\n*:focus {\n  outline: none;\n}\nbody, html { \n  overflow-x: hidden; \n  overflow-y: auto;\n}\nbody {\n  position: relative;\n}\n.modal { \n  top: 0; \n  width: 100%; \n  position: fixed; \n  background-color: grey; \n  height: 100vh; \n}\n.waveform {\n  width: 100vw;\n  height: 15vh;\n  background-color: white;\n  content: '';\n  position: fixed;\n  transform: translateX(50vw);\n  bottom: 15vh;\n  left: 0;\n  z-index: 3;\n}\n.cover-bg {\n  width: 100vh;\n  height: 100vh;\n  position: fixed;\n  background-color: blue;\n}\n.modal-hidden { transform: translateY(100vh); }\n.modal-entering { animation: modal-entering ease-out 0.3s 1 forwards; }\n.modal-visible { transform: translateY(0); }\n.modal-leaving { animation: modal-leaving ease-in 0.3s 1 forwards; }\n\n@keyframes modal-entering {\n  from { transform: translateY(100vh); }\n  to { transform: translateY(0); }\n}\n\n@keyframes modal-leaving {\n  from { transform: translateY(0); }\n  to { transform: translateY(100vh); }\n}\n\n.fadein {\n  animation: fadein 1s ease-in forwards;\n}\n.fadeout {\n  opacity: 0;\n  transition: 1s;\n}\n@keyframes fadein {\n  0% { opacity: 0; }\n  100% { opacity: 1; }\n}") || true) && "_1b87d681")

document.addEventListener('deviceready', () => createFS(), false)

var app = choo()

// app.use(devtools())
app.use(routes())

app.use(function (state, emitter) {
  state.storageSource = 0
  state.playlists = [
    { title: 'My playlist A', tracks: [{ title: '', artist: '' }] },
    { title: 'My playlist B' }
  ]

  emitter.on('DOMContentLoaded', function () {
    emitter.on('select-storage-source', function (storageSource) {
      state.storageSource = storageSource
      emitter.emit('render')
    })
  })
})

app.mount('body')

},{"./lib/mobile-fs":62,"./routes":63,"choo":17,"choo-devtools":8,"nanoquery":37,"sheetify/insert":50}],62:[function(require,module,exports){
var mobileFS = {
  fs: null,
  createFS: function createFS (done) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, _fs_ => {
      var fs = FS(_fs_)
      module.exports = fs
      done(fs)
    }, console.error)
  }
}

module.exports = mobileFS

function FS (_fs_) {
  if (!(this instanceof FS)) return new FS(_fs_)
  this._fs = _fs_
}

FS.prototype.readFile = function (src, callback) {
  var opts = { create: false, exclusive: false }

  this._fs.root.getFile(src, opts, function (fileEntry) {
    fileEntry.file(function (file) {
      var reader = new window.FileReader()

      reader.onloadend = function () {
        callback(null, this.result)
      }

      reader.readAsText(file)
    }, callback)
  }, callback)
}

FS.prototype.writeFile = function (src, data, callback) {
  var opts = { create: true, exclusive: false }

  this._fs.root.getFile(src, opts, function (fileEntry) {
    fileEntry.createWriter(function (fileWriter) {
      fileWriter.onwriteend = function () {
        callback()
      }

      fileWriter.onerror = function (err) {
        callback(err)
      }

      var blob = new window.Blob([data], { type: 'text/plain' })

      fileWriter.write(blob)
    })
  }, callback)
}

},{}],63:[function(require,module,exports){
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

},{"./TransitionGroup":60,"choo/html":16}]},{},[61]);
