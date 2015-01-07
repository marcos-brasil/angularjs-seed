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
import { angular, queryDom, $body } from 'globals';

export { navBar } from './nav-bar'

export function headerBar () {
  return {
    template: fs.readFileSync('./src/scripts/components/header-bar.html', 'utf8'),
    restrict: 'E',
  }
}

export function mainContent () {
  return {
    restrict: 'E',
    template: `
      <main>
        ${fs.readFileSync('./src/scripts/components/main-content.html', 'utf8')}
      </main>
    `,
    link (scope, elem) {
      var navdrawerContainer = queryDom('.navdrawer-container');
      var appbarElement = queryDom('.app-bar');

      elem.bind('click', function onClick (scope, elem, attr) {
        $body.classList.remove('open');
        appbarElement.classList.remove('open');
        navdrawerContainer.classList.remove('open');
      })
    },
  }
}

export function menu () {
  return {
    restrict: 'C',
    link (scope, elem) {
      var navdrawerContainer = queryDom('.navdrawer-container');
      var appbarElement = queryDom('.app-bar');

      elem.bind('click', function onClick (scope, elem, attr) {
        $body.classList.toggle('open');
        appbarElement.classList.toggle('open');
        navdrawerContainer.classList.toggle('open');
        navdrawerContainer.classList.add('opened');
      })
    },
  }
}

