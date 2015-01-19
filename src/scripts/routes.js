'use strict';

var _indexState = {
  url: '/',
  controller: indexRouteCtrl,
  onEnter () {

  },
  template: `<root-app/>`,
  elements: {},
  scope: {
    some: 'data',
    get rand () {
      /*jslint bitwise: true */
      return (Math.random() * Math.pow(10,7)|0);
      /*jslint bitwise: false */
    },
  },
};

var firstLoad = true;
indexRouteCtrl.$inject = ['$state', '$rootScope', '$body'];
function indexRouteCtrl ($state, $rootScope, $body) {


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

routerConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
export function routerConfig ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state(Object.assign({name: 'index'}, _indexState, {url: '/'}))

      .state({
        name: 'styleguide',
        url: '/styleguide',
        templateUrl: '/styleguide.html'
      })
      .state({
        name: 'tests',
        url: '/tests',
        controller: ['$window', ($window) => {
          $window.location.reload(true);
        }],
        template: ''
      })
      .state('404', {
        url: '/{base}',
        templateUrl: '/404.html',
        controller: _404,
        onExit: () => clearInterval(flickerIntervalId),
      });
}

var flickerIntervalId;


function _404 () {
  var canvas;
  var ctx;
  var imgData;
  var pix;
  var WIDTH;
  var HEIGHT;

  function flickering () {
    for (var i = 0; i < pix.length; i += 4) {
      var color = (Math.random() * 255) + 50;
      pix[i] = color;
      pix[i + 1] = color;
      pix[i + 2] = color;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  canvas.width = WIDTH = 700;
  canvas.height = HEIGHT = 500;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fill();
  imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
  pix = imgData.data;
  flickerIntervalId = setInterval(flickering, 30);
}

          // $state.transitionTo($state.current, $state.params, {
          //   reload: true,
          //   inherit: false,
          //   notify: true,
          // })

