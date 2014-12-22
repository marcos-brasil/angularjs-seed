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

import {close} from './close';
import {toggle} from './toggle';

export function main ($doc) {

  var querySelector = $doc.querySelector.bind($doc);
  var navdrawerContainer = querySelector('.navdrawer-container');
  var menuBtn = querySelector('.menu');
  var mainEl = querySelector('main');

  if (!mainEl) { return; }

  var closeMenu = close($doc);
  var toggleMenu = toggle($doc);

  mainEl.addEventListener('click', closeMenu);
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', (event) => {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });

}


