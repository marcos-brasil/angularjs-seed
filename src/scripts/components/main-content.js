'use strict';
import * as fs from 'fs';
import { queryDom, $body } from 'globals';

export function mainContent () {
  return {
    restrict: 'E',
    template () {
      console.log('RRRR', Math.random());
      return fs.readFileSync('./src/scripts/components/main-content.html', 'utf8');
    },

    link (scope, elem) {
      var navdrawerContainer = queryDom('.navdrawer-container');
      var appbarElement = queryDom('.app-bar');

      elem.bind('click', function onClick (scope, elem, attr) {
        $body.classList.remove('open');
        appbarElement.classList.remove('open');
        navdrawerContainer.classList.remove('open');
      });
    },
  };
}
