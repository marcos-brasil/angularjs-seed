/*jshint bitwise: false*/

'use strict';
import co from 'co';

rootAppCtrl.$inject = ['$scope', '$timeout', '$sce', '$route'];
function rootAppCtrl ($scope, $timeout, $sce, $route) {
  co(function * () {

    // next tick
    yield new Promise((res) => $timeout(res));

    var t0 = new Date()
    var cnt = 0;
    while (++cnt) { // event loop

      // 33 millisec ~ 30 FPS
      var t1 = 31 - (new Date() - t0)
      if (t1 > 0) {
        yield new Promise((res) => $timeout(res, t1));
      }
      else if (0 === t1) {
        yield new Promise((res) => $timeout(res));
      }

      if((cnt % 20) === 0) {
        console.log(`${1000/(new Date() - t0)|0} FPS @ ${cnt}`);
      }

      t0 = new Date();
      // fake async op
      yield new Promise((res) => $timeout(res));

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
