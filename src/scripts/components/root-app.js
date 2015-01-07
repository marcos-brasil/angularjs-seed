/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';
import * as fs from 'fs'
import co from 'co'
import { angular, queryDom, $body } from 'globals';

rootAppCtrl.$inject = ['$scope', '$timeout', '$sce', '$route']
function rootAppCtrl ($scope, $timeout, $sce, $route) {
  co(function * () {

    yield new Promise((res) => $timeout(res))

    var cnt = 0
    while (true) { // event loop
      // 33 millisec ~ 30 FPS
      var t0 = new Date
      yield new Promise((res) => $timeout(res, 30))
      cnt++

      if(!(cnt % 20)) {
        console.log(`${1000/(new  Date - t0)|0} FPS @ ${cnt}`)
      }


      $scope.$digest()

    }
  })

  console.log('@@@', $route)
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
    link (scope){ console.log('^^^^^')},
  }
}
