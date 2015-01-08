'use strict';

import co from 'co';

var _indexState = {
  url: '',
  controller: indexCtrl,
  template: ` <root-app/>`,
};

indexCtrl.$inject = ['$scope', '$rootScope', '$q', '$sce', '$state'];
function indexCtrl ($scope, $root, $q, $sce, $state) {
  co(function * (){
    yield new Promise(setImmediate);
    console.log('indexStateCtrl');
  });
}

routerConfig.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
export function routerConfig ($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', Object.assign({}, _indexState, {url: '/'}))

      .state({
        name: 'tests',
        url: '/tests',
        controller () {
          // forcing a hard page reload
          window.location.reload(true);
        },
        template: '<test></test>'
      })
      .state({
        name: 'styleguide',
        url: '/styleguide',
        templateUrl: '/styleguide.html'

      })
      .state('404', {
        url: '/{base}',
        templateUrl: '/404.html',
        controller: fourOhFour,
      });
}

function fourOhFour () {
  var canvas;
  var ctx;
  var imgData;
  var pix;
  var WIDTH;
  var HEIGHT;
  var flickerInterval;

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
  flickerInterval = setInterval(flickering, 30);
}

