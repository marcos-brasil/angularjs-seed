'use strict';
import * as fs from 'fs';

export function headerBar () {
  return {
    restrict: 'EA',
    template: fs.readFileSync('./src/scripts/directives/header-bar/index.html', 'utf8'),
  };
}

menu.$inject = ['$state', '$body', 'openNavdrawer']
export function menu ($state, $body, openNavdrawer) {
  return {
    restrict: 'C',
    link (scope, elem, attr) {
      if ($state.opened) { setImmediate(openNavdrawer) }
      elem.bind('click', openNavdrawer);
    },
  };
}

appBar.$inject = ['$state']
export function appBar ($state) {
  return {
    restrict: 'C',
    link (scope, elem, attr) {
      $state.elements.appBar = elem
    },
  }
}
