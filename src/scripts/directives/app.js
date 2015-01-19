/*jshint bitwise: false*/

'use strict';
import co from 'co';

var _t0 = new Date();
var _cnt = 0;

export function app () {
  return {
    restrict: 'EA',
    controller: appCtrl,
    template: `
      <header-bar></header-bar>
      <nav-bar></nav-bar>
      <main-content></main-content>
    `,
  };
}

appCtrl.$inject = ['$scope',  '$state'];
function appCtrl ($scope, $state) {
  co(function * () {
    // defering execution to "nextTick"
    yield new Promise(setImmediate);

    var offset = 2;
    var FPS = 30 + offset;

    // event loop
    while (++_cnt) {

      // sleeping
      yield* _waitNextFrame(FPS);
      // and faking 10 millisec async op
      yield new Promise((res) => setTimeout(res, 10));

      Object.assign($scope, $state.current.scope);
      $scope.$digest();

    }
  }).catch((err)=>{ console.log('EE:', err); });
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
