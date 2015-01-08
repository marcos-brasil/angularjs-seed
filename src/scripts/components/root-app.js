/*jshint bitwise: false*/

'use strict';
import co from 'co';

var _t0 = new Date();
var _cnt = 0;

export function rootApp () {
  return {
    restrict: 'E',
    controller: rootAppCtrl,
    template: `
      <header-bar></header-bar>
      <nav-bar></nav-bar>
      <main-content></main-content>
    `,
  };
}

rootAppCtrl.$inject = ['$scope', '$q', '$sce', '$state'];
function rootAppCtrl ($scope, $q, $sce, $state) {
  co(function * () {

    yield new Promise(setImmediate);
    var offset = 2;
    var FPS = 30 + offset;

    // event loop
    while (++_cnt) {

      // sleeping
      yield* _waitNextFrame(FPS);

      // fake 10 millisec async op
      yield new Promise((res) => setTimeout(res, 10));
      $scope.rand = Math.random();
      $scope.$digest();
    }
  });
}

function * _waitNextFrame (FPS) {
  // time left on this cycle

  var t2 = new Date() - _t0;
  var t1 = (1000/FPS - (t2))|0;

  if (t1 > 2) {
    yield new Promise((res) => setTimeout(res, t1));
  }
  else {
    yield new Promise((res) => setImmediate(res));
  }

  // if((_cnt % 20) === 0) {
  //   var fps = 1000/(new Date() - _t0)|0
  //   console.log(`FPS: ${fps} - free: ${t1}ms - used: ${t2}ms - loop count: ${_cnt}`);
  // }

  _t0 = new Date();

}
