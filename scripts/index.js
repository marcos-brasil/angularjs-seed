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
exports.appBar = appBar;
"use strict";


function headerBar() {
  return {
    restrict: "EA",
    template: "\n<header class=\"app-bar promote-layer\">\n  <div class=\"app-bar-container\">\n    <button class=\"menu\"><img src=\"/seed/images/hamburger.svg\" alt=\"Menu\"></button>\n    <h1 class=\"logo\">Web <strong>Starter Kit</strong></h1>\n    <section class=\"app-bar-actions\">\n      <!-- Put App Bar Buttons Here-->\n      <button><i class=\"icon icon-star\"></i></button>\n      <button><i class=\"icon icon-cog\"></i></button>\n    </section>\n  </div>\n</header>\n" };
}

menu.$inject = ["$state", "$body", "openNavdrawer"];
function menu($state, $body, openNavdrawer) {
  return {
    restrict: "C",
    link: function link(scope, elem, attr) {
      if ($state.opened) {
        setImmediate(openNavdrawer);
      }
      elem.bind("click", openNavdrawer);
    } };
}

appBar.$inject = ["$state"];
function appBar($state) {
  return {
    restrict: "C",
    link: function link(scope, elem, attr) {
      $state.elements.appBar = elem;
    } };
}

},{}],3:[function(_dereq_,module,exports){
"use strict";
/*jshint -W030 */
/*jshint -W033 */
/*jshint -W117 */

exports.mainContent = _dereq_(4).mainContent;
exports.rootApp = _dereq_(6).rootApp;
exports.headerBar = _dereq_(2).headerBar;
exports.menu = _dereq_(2).menu;
exports.appBar = _dereq_(2).appBar;
exports.navBar = _dereq_(5).navBar;
exports.navdrawerContainer = _dereq_(5).navdrawerContainer;

},{}],4:[function(_dereq_,module,exports){
"use strict";

exports.mainContent = mainContent;
"use strict";



mainContent.$inject = ["$state", "$body", "closeNavdrawer"];
function mainContent($state, $body, closeNavdrawer) {
  return {
    restrict: "EA",
    template: function template() {
      return "<main>\n  <h1 id=\"hello\">Hello!</h1>\n  <p>Welcome to my <a href=\"https://developers.google.com/web/starter-kit/\">Web Starter Kit</a> fork. <small>{{rand}}</small></p>\n  <h3 id=\"get-started\">Features :</h3>\n\n  <ul>\n    <li><a href=\"https://6to5.org/\"> ES6 </a> </li>\n    <li><a href=\"https://angularjs.org/\">Angular</a> <small>» <a href=\"https://github.com/angular-ui/ui-router\">ui-router</small></a> </li>\n    <li><a href=\"http://mochajs.org/\">Mocha</a> <small>» <a href=\"http://chaijs.com/\">chai</a> - <a href=\"http://sinonjs.org/\">sinon</a></small> </li>\n    <li><a href=\"http://browserify.org/\">Browserify</a>\n    <li><a href=\"http://gulpjs.com/\">Gulp</a></li>\n    <li><a href=\"http://nodejs.org/\">Nodejs</a></li>\n  </ul>\n  <!-- <p>Read how to <a href=\"https://developers.google.com/web/starter-kit\">Get Started</a> or check out the <a href=\"styleguide.html\">Style Guide.</a></p> -->\n</main>\n";
    },
    link: function link(scope, elem) {
      elem.bind("click", closeNavdrawer);
    } };
}

},{}],5:[function(_dereq_,module,exports){
"use strict";

exports.navBar = navBar;
exports.navdrawerContainer = navdrawerContainer;
"use strict";
/*jslint bitwise: true */
var rand = (Math.random() * Math.pow(10, 7) | 0).toString(36);
/*jslint bitwise: true */

var hrefs = ["/", "styleguide", "tests", rand];
var list = ["Home", "Style Guide", "Tests", "{{rand}}"];

function iterator(v, k) {
  return "<li><a href=\"/seed/" + hrefs[k] + "\">" + v + "</a></li>";
}

navBar.$inject = ["$state", "closeNavdrawer"];
function navBar($state, closeNavdrawer) {
  return {
    restrict: "EA",
    scope: {},
    template: "\n      <nav class=\"navdrawer-container promote-layer\">\n        <h4>Navigation</h4>\n        <ul>\n          " + list.map(iterator).join("\n") + "\n        </ul>\n      </nav>\n    ",
    controller: ["$scope", function ($scope) {
      return $scope.rand = rand;
    }],
    link: function link(scope, elem, attr) {
      elem.bind("click", function (evt) {
        console.log(evt.target.pathname.match(/^\/seeds/));
        if (evt.target.pathname.match(/^\/seed/)) {
          // TODO: learn css ng-animation, then use $state.transitionTo
          setImmediate(closeNavdrawer);
        }
      });
    } };
}

navdrawerContainer.$inject = ["$state"];
function navdrawerContainer($state) {
  return {
    restrict: "C",
    link: function link(scope, elem, attr) {
      $state.elements.navdrawerContainer = elem;
    } };
}

},{}],6:[function(_dereq_,module,exports){
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
    restrict: "EA",
    controller: rootAppCtrl,
    template: "\n      <header-bar></header-bar>\n      <nav-bar></nav-bar>\n      <main-content></main-content>\n    " };
}

rootAppCtrl.$inject = ["$scope", "$state"];
function rootAppCtrl($scope, $state) {
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
          return context$2$0.delegateYield(_waitNextFrame(FPS), "t4", 6);
        case 6:
          context$2$0.next = 8;
          return new Promise(function (res) {
            return setTimeout(res, 10);
          });
        case 8:


          Object.assign($scope, $state.current.scope);
          $scope.$digest();

          context$2$0.next = 4;
          break;
        case 12:
        case "end":
          return context$2$0.stop();
      }
    }, callee$1$0, this);
  }))["catch"](function (err) {
    console.log("EE:", err);
  });
}

// defering execution to "nextTick"


// event loop


// sleeping
// and faking 10 millisec async op
// time left on this cycle

},{}],7:[function(_dereq_,module,exports){
"use strict";
var $doc = exports.$doc = document;
var $win = exports.$win = window;
var $body = exports.$body = $doc.body;

var angular = exports.angular = $win.angular;
var queryDom = exports.queryDom = $doc.querySelector.bind($doc);

var documentReady = exports.documentReady = new Promise(function (resolve, reject) {
  if ($doc.readyState === "complete") {
    return resolve();
  }

  function loaded() {
    // after DOM loaded, cleanup
    $doc.removeEventListener("DOMContentLoaded", loaded, false);
    $win.removeEventListener("load", loaded, false);
    resolve();
  }

  // making double sure we get the document load event
  $doc.addEventListener("DOMContentLoaded", loaded, false);
  $win.addEventListener("load", loaded, false);
});

},{}],8:[function(_dereq_,module,exports){
"use strict";



var angular = _dereq_(7).angular;
var directives = _dereq_(3);

var services = _dereq_(10);

var routerConfig = _dereq_(9).routerConfig;


console.log("\nThe MIT License (MIT)\n\nCopyright (c) 2014, markuz-brasil\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\nTHE SOFTWARE.\n\n");

var APP = exports.APP = angular.module("app", ["ui.router"]);

for (var item in directives) {
  APP.directive(item, directives[item]);
}

for (var item in services) {
  APP.factory(item, services[item]);
}

APP.config(routerConfig).run(["$state", function ($state) {
  $state.elements = {};
}]);

},{}],9:[function(_dereq_,module,exports){
"use strict";

exports.routerConfig = routerConfig;
"use strict";

var _indexState = {
  url: "/",
  controller: indexRouteCtrl,
  onEnter: function onEnter() {},
  template: "<root-app/>",
  elements: {},
  scope: (function (_scope) {
    Object.defineProperties(_scope, {
      rand: {
        get: function () {
          /*jslint bitwise: true */
          return Math.random() * Math.pow(10, 7) | 0;
          /*jslint bitwise: false */
        },
        enumerable: true
      }
    });

    return _scope;
  })({
    some: "data" }) };

var firstLoad = true;
indexRouteCtrl.$inject = ["$state", "$rootScope", "$body"];
function indexRouteCtrl($state, $rootScope, $body) {


  // console.log($state.opened)

  if (firstLoad) {
    firstLoad = false;
    return;
  }

  if ($state.opened) {}

  // var { appBar, navdrawerContainer } = $state.elements
  // $body.removeClass('open');
  // appBar.removeClass('open')
  // navdrawerContainer.removeClass('open')
  // $state.current.opened = false
  // co(function * (){
  //   yield new Promise(setImmediate);
  // });

}
routerConfig.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];
function routerConfig($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");

  $urlRouterProvider.when("/", "index");
  $urlRouterProvider.when("/seed/", "index");
  $urlRouterProvider.otherwise("/seed");

  $stateProvider.state("index", Object.assign({}, _indexState, { url: "/seed" })).state({
    name: "styleguide",
    url: "/seed/styleguide",
    templateUrl: "/seed/styleguide.html"
  }).state({
    name: "tests",
    url: "/seed/tests",
    controller: ["$window", function ($window) {
      $window.location.reload(true);
    }],
    template: ""
  }).state({
    name: "404",
    url: "/seed/{base}",
    templateUrl: "/seed/404.html",
    controller: _404,
    onExit: function () {
      return clearInterval(flickerIntervalId);
    } });
}

// TODO: use ui-route state managment instead of globals
var flickerIntervalId;

function _404() {
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

},{}],10:[function(_dereq_,module,exports){
"use strict";

exports.$jq = $jq;
exports.$body = $body;
exports.closeNavdrawer = closeNavdrawer;
exports.openNavdrawer = openNavdrawer;
"use strict";

var body = _dereq_(7).$body;
var angular = _dereq_(7).angular;
function $jq() {
  return angular.element;
}

$body.$inject = ["$jq"];
function $body($jq) {
  return $jq(body);
}

closeNavdrawer.$inject = ["$state", "$body"];
function closeNavdrawer($state, $body) {
  return function closeNavdrawerService() {
    var appBar = $state.elements.appBar;
    var navdrawerContainer = $state.elements.navdrawerContainer;
    $body.removeClass("open");
    appBar.removeClass("open");
    navdrawerContainer.removeClass("open");
    $state.opened = false;
  };
}

openNavdrawer.$inject = ["$state", "$body"];
function openNavdrawer($state, $body) {
  return function openNavdrawerService() {
    var appBar = $state.elements.appBar;
    var navdrawerContainer = $state.elements.navdrawerContainer;
    $body.toggleClass("open");
    appBar.toggleClass("open");
    navdrawerContainer.toggleClass("open");
    navdrawerContainer.addClass("opened");
    $state.opened = true;
  };
}

},{}]},{},[8])


//# sourceMappingURL=maps/index.js.map