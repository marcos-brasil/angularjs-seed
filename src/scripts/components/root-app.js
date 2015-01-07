/*jshint bitwise: false*/
'use strict';
import co from 'co';

rootAppCtrl.$inject = ['$scope', '$timeout', '$sce', '$route'];
function rootAppCtrl ($scope, $timeout, $sce, $route) {
  co(function * () {

    yield new Promise((res) => $timeout(res));

    var cnt = 0;
    while (++cnt) { // event loop
      // 33 millisec ~ 30 FPS
      var t0 = new Date();
      yield new Promise((res) => $timeout(res, 30));

      if((cnt % 20) === 0) {
        console.log(`${1000/(new Date() - t0)|0} FPS @ ${cnt}`);
      }

      $scope.$digest();
    }
  });

  console.log('@@@', $route);
}

export function rootApp () {
  return {
    restrict: 'E',
    controller: rootAppCtrl,
    template: `
      <header-bar></header-bar>
      <nav-bar></nav-bar>
      <main-content></main-content>
    `,
    link (scope){ console.log('^^^^^');},
  };
}
