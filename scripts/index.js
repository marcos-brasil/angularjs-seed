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

exports.headerBar = headerBar;
exports.menu = menu;
"use strict";


var queryDom = _dereq_(6).queryDom;
var $body = _dereq_(6).$body;
var navBar = _dereq_(4).navBar;
var mainContent = _dereq_(3).mainContent;
var rootApp = _dereq_(5).rootApp;
exports.navBar = navBar;
exports.mainContent = mainContent;
exports.rootApp = rootApp;
function headerBar() {
  return {
    restrict: "E",
    template: "\n<header class=\"app-bar promote-layer\">\n  <div class=\"app-bar-container\">\n    <button class=\"menu\"><img src=\"images/hamburger.svg\" alt=\"Menu\"></button>\n    <h1 class=\"logo\">Web <strong>Starter Kit</strong></h1>\n    <section class=\"app-bar-actions\">\n      <!-- Put App Bar Buttons Here-->\n      <button><i class=\"icon icon-star\"></i></button>\n      <button><i class=\"icon icon-cog\"></i></button>\n    </section>\n  </div>\n</header>\n" };
}

function menu() {
  return {
    restrict: "C",
    link: function link(scope, elem) {
      var navdrawerContainer = queryDom(".navdrawer-container");
      var appbarElement = queryDom(".app-bar");

      elem.bind("click", function onClick(scope, elem, attr) {
        $body.classList.toggle("open");
        appbarElement.classList.toggle("open");
        navdrawerContainer.classList.toggle("open");
        navdrawerContainer.classList.add("opened");
      });
    } };
}

},{}],3:[function(_dereq_,module,exports){
"use strict";

exports.mainContent = mainContent;
"use strict";



var queryDom = _dereq_(6).queryDom;
var $body = _dereq_(6).$body;
function mainContent() {
  return {
    restrict: "E",
    template: function template() {
      return "<main>\n  <h1 id=\"hello\">Hello!</h1>\n  <p>Welcome to my <a href=\"https://developers.google.com/web/starter-kit/\">Web Starter Kit</a> fork.</p>\n  <h3 id=\"get-started\">Features :</h3>\n  <ul>\n    <li><a href=\"https://6to5.org/\"> ES6 </a> </li>\n    <li><a href=\"https://angularjs.org/\">Angular</a> » <a href=\"https://github.com/angular-ui/ui-router\">ui-router</a> </li>\n    <li><a href=\"http://mochajs.org/\">Mocha</a> » <a href=\"http://chaijs.com/\">chai</a> - <a href=\"http://sinonjs.org/\">sinon</a> </li>\n    <li><a href=\"http://browserify.org/\">Browserify</a>\n    <li><a href=\"http://gulpjs.com/\">Gulp</a></li>\n    <li><a href=\"http://nodejs.org/\">Nodejs</a></li>\n  </ul>\n  <!-- <p>Read how to <a href=\"https://developers.google.com/web/starter-kit\">Get Started</a> or check out the <a href=\"styleguide.html\">Style Guide.</a></p> -->\n</main>\n";
    },

    link: function link(scope, elem) {
      var navdrawerContainer = queryDom(".navdrawer-container");
      var appbarElement = queryDom(".app-bar");

      elem.bind("click", function onClick(scope, elem, attr) {
        $body.classList.remove("open");
        appbarElement.classList.remove("open");
        navdrawerContainer.classList.remove("open");
      });
    } };
}

},{}],4:[function(_dereq_,module,exports){
"use strict";

exports.navBar = navBar;
"use strict";

function navBar() {
  var hrefs = ["hello", "styleguide", "tests", "/"];
  var list = ["Hello", "Style Guide", "Tests", "{{rand}}"];

  function iterator(v, k) {
    return "<li><a href=\"/seed/" + hrefs[k] + "\">" + v + "</a></li>";
  }

  return {
    restrict: "E",
    template: "\n      <nav class=\"navdrawer-container promote-layer\">\n        <h4>Navigation</h4>\n        <ul>\n          " + list.map(iterator).join("\n") + "\n        </ul>\n      </nav>\n      ",
    controller: ["$scope", function ($scope) {
      return $scope.rand = Math.random();
    }]
  };
}

},{}],5:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _waitNextFrame = regeneratorRuntime.mark(function _waitNextFrame(FPS) {
  var t2, t1;
  return regeneratorRuntime.wrap(function _waitNextFrame$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        t2 = new Date() - _t0;
        t1 = 1000 / FPS - t2 | 0;
        if (!(t1 > 2)) {
          context$1$0.next = 7;
          break;
        }
        context$1$0.next = 5;
        return new Promise(function (res) {
          return setTimeout(res, t1);
        });
      case 5:
        context$1$0.next = 9;
        break;
      case 7:
        context$1$0.next = 9;
        return new Promise(function (res) {
          return setImmediate(res);
        });
      case 9:


        // if((_cnt % 20) === 0) {
        //   var fps = 1000/(new Date() - _t0)|0
        //   console.log(`FPS: ${fps} - free: ${t1}ms - used: ${t2}ms - loop count: ${_cnt}`);
        // }

        _t0 = new Date();

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, _waitNextFrame, this);
});

exports.rootApp = rootApp;
/*jshint bitwise: false*/

"use strict";
var co = _interopRequire(_dereq_(1));

var _t0 = new Date();
var _cnt = 0;

function rootApp() {
  return {
    restrict: "E",
    controller: rootAppCtrl,
    template: "\n      <header-bar></header-bar>\n      <nav-bar></nav-bar>\n      <main-content></main-content>\n    " };
}

rootAppCtrl.$inject = ["$scope", "$q", "$sce", "$state"];
function rootAppCtrl($scope, $q, $sce, $state) {
  co(regeneratorRuntime.mark(function callee$1$0() {
    var offset, FPS;
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return new Promise(setImmediate);
        case 2:
          offset = 2;
          FPS = 30 + offset;
        case 4:
          if (! ++_cnt) {
            context$2$0.next = 12;
            break;
          }
          return context$2$0.delegateYield(_waitNextFrame(FPS), "t10", 6);
        case 6:
          context$2$0.next = 8;
          return new Promise(function (res) {
            return setTimeout(res, 10);
          });
        case 8:
          $scope.rand = Math.random();
          $scope.$digest();
          context$2$0.next = 4;
          break;
        case 12:
        case "end":
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
}

// event loop


// sleeping


// fake 10 millisec async op
// time left on this cycle

},{}],6:[function(_dereq_,module,exports){
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

},{}],7:[function(_dereq_,module,exports){
"use strict";



var angular = _dereq_(6).angular;
var components = _dereq_(2);

var routerConfig = _dereq_(8).routerConfig;


console.log("\nThe MIT License (MIT)\n\nCopyright (c) 2014, markuz-brasil\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\nTHE SOFTWARE.\n\n");

var APP = exports.APP = angular.module("app", ["ui.router"]);

APP.config(routerConfig);

for (var item in components) {
  APP.directive(item, components[item]);
}

},{}],8:[function(_dereq_,module,exports){
"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

exports.routerConfig = routerConfig;
"use strict";

var co = _interopRequire(_dereq_(1));

var _indexState = {
  url: "",
  controller: indexCtrl,
  template: " <root-app/>" };

indexCtrl.$inject = ["$scope", "$rootScope", "$q", "$sce", "$state"];
function indexCtrl($scope, $root, $q, $sce, $state) {
  co(regeneratorRuntime.mark(function callee$1$0() {
    return regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return new Promise(setImmediate);
        case 2:
        case "end":
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }));
}

routerConfig.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
function routerConfig($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");

  $urlRouterProvider.when("/", "index");
  $urlRouterProvider.when("/seed/", "index");
  $urlRouterProvider.otherwise("/seed");

  $stateProvider.state("index", Object.assign({}, _indexState, { url: "/seed" })).state({
    name: "tests",
    url: "/seed/tests",
    controller: function controller() {
      // forcing a hard page reload
      window.location.reload(true);
    } }).state({
    name: "styleguide",
    url: "/seed/styleguide",
    templateUrl: "/seed/styleguide.html"
  }).state({
    name: "404",
    url: "/seed/{base}",
    templateUrl: "/seed/404.html",
    controller: fourOhFour,
    onExit: function () {
      return clearInterval(flickerIntervalId);
    } });
}

// TODO: use ui-route state managment instead of globals
var flickerIntervalId;

function fourOhFour() {
  var canvas;
  var ctx;
  var imgData;
  var pix;
  var WIDTH;
  var HEIGHT;

  function flickering() {
    for (var i = 0; i < pix.length; i += 4) {
      var color = Math.random() * 255 + 50;
      pix[i] = color;
      pix[i + 1] = color;
      pix[i + 2] = color;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = WIDTH = 700;
  canvas.height = HEIGHT = 500;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fill();
  imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  pix = imgData.data;
  flickerIntervalId = setInterval(flickering, 30);
}

},{}]},{},[7])


//# sourceMappingURL=maps/index.js.map