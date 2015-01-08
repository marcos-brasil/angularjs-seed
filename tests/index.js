(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * slice() reference.
 */

var slice = Array.prototype.slice;

/**
 * Expose `co`.
 */

module.exports = co['default'] = co.co = co;

/**
 * Wrap the given generator `fn` into a
 * function that returns a promise.
 * This is a separate function so that
 * every `co()` call doesn't create a new,
 * unnecessary closure.
 *
 * @param {GeneratorFunction} fn
 * @return {Function}
 * @api public
 */

co.wrap = function (fn) {
  return function () {
    return co.call(this, fn.apply(this, arguments));
  };
};

/**
 * Execute the generator function or a generator
 * and return a promise.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

function co(gen) {
  var ctx = this;
  if (typeof gen === 'function') gen = gen.call(this);
  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  return new Promise(function(resolve, reject) {
    onFulfilled();

    /**
     * @param {Mixed} res
     * @return {Promise}
     * @api private
     */

    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * @param {Error} err
     * @return {Promise}
     * @api private
     */

    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    /**
     * Get the next value in the generator,
     * return a promise.
     *
     * @param {Object} ret
     * @return {Promise}
     * @api private
     */

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}

/**
 * Convert a `yield`ed value into a promise.
 *
 * @param {Mixed} obj
 * @return {Promise}
 * @api private
 */

function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}

/**
 * Convert a thunk to a promise.
 *
 * @param {Function}
 * @return {Promise}
 * @api private
 */

function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}

/**
 * Convert an array of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Array} obj
 * @return {Promise}
 * @api private
 */

function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

/**
 * Convert an object of "yieldables" to a promise.
 * Uses `Promise.all()` internally.
 *
 * @param {Object} obj
 * @return {Promise}
 * @api private
 */

function objectToPromise(obj){
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    if (promise && isPromise(promise)) defer(promise, key);
    else results[key] = obj[key];
  }
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isPromise(obj) {
  return 'function' == typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  return constructor && 'GeneratorFunction' == constructor.name;
}

/**
 * Check for plain object.
 *
 * @param {Mixed} val
 * @return {Boolean}
 * @api private
 */

function isObject(val) {
  return Object == val.constructor;
}

},{}],2:[function(_dereq_,module,exports){
"use strict";

exports.documentReady = documentReady;
"use strict";
var $doc = exports.$doc = document;
var $win = exports.$win = window;
var $body = exports.$body = $doc.body;

var angular = exports.angular = $win.angular;
var queryDom = exports.queryDom = $doc.querySelector.bind($doc);

function documentReady(next) {
  if ($doc.readyState === "complete") {
    return next();
  }

  function _loaded() {
    // after DOM loaded, cleanup
    $doc.removeEventListener("DOMContentLoaded", _loaded, false);
    $win.removeEventListener("load", _loaded, false);
    next();
  }

  // making double sure we get the document load event
  $doc.addEventListener("DOMContentLoaded", _loaded, false);
  $win.addEventListener("load", _loaded, false);
}

},{}],3:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

exports.testsApp = testsApp;
// current 6to5 shim doesn't include setImmediate.
// but on v2.0 it will

/* jshint -W030 */

"use strict";

var co = _interopRequire(_dereq_(1));

var angular = _dereq_(2).angular;
var queryDom = _dereq_(2).queryDom;
var documentReady = _dereq_(2).documentReady;
var $win = _dereq_(2).$win;
var $doc = _dereq_(2).$doc;
var $body = _dereq_(2).$body;


mocha.setup("bdd");
mocha.reporter("html");

var expect = chai.expect;


co(regeneratorRuntime.mark(function callee$0$0() {
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return new Promise(function (res, rej) {
          return documentReady(res);
        });
      case 2:
        mocha.run();
      case 3:
      case "end":
        return context$1$0.stop();
    }
  }, callee$0$0, this);
}));

angular.module("app").directive("testApp", testsApp);



function testsApp() {
  return {
    restrict: "E",
    controller: testAppCtrl };
}


function testAppCtrl() {
  describe("basic globals tests", function () {
    it("should be functions", function () {
      expect(queryDom).to.be["instanceof"](Function);
      expect(documentReady).to.be["instanceof"](Function);
    });

    it("should be objects", function () {
      expect(angular).to.be["instanceof"](Object);
      expect($win).to.be.deep.equal(window);
      expect($doc).to.be.deep.equal(document);
      expect($body).to.be.deep.equal(document.body);
    });

    it("should use spy", function () {
      var spy = sinon.spy();
      function tobeSpied(cb) {
        cb();cb();
      }

      tobeSpied(spy);
      expect(spy).to.have.been.calledTwice;
    });
  });
}

},{}]},{},[3])


//# sourceMappingURL=maps/index.js.map