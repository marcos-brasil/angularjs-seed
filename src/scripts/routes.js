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
    $urlRouterProvider.otherwise('/404');

    $stateProvider
      .state('index', Object.assign({}, _indexState, {url: '/'}))
      .state('hello', Object.assign({}, _indexState, {url: '/hello'}))

      .state({
        name: 'tests',
        url: '/tests',
        controller () {
          // forcing a hard page reload
          window.location.reload(true);
        },
        template: '<test></test>'
      })

      .state('404', {
        url: '/404',
        template: `<b>404</b>`
      });
}

