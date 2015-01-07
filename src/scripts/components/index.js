'use strict';
import * as fs from 'fs';
import { queryDom, $body } from 'globals';

import { navBar } from './nav-bar';
import { mainContent } from './main-content';
import { rootApp } from './root-app';

export { navBar, mainContent, rootApp };

export function headerBar () {
  return {
    template: fs.readFileSync('./src/scripts/components/header-bar.html', 'utf8'),
    restrict: 'E',
  };
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
      });
    },
  };
}

