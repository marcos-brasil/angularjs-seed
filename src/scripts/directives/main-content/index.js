'use strict';

import * as fs from 'fs';

mainContent.$inject = ['$state', '$body', 'closeNavdrawer']
export function mainContent ($state, $body, closeNavdrawer) {
  return {
    restrict: 'EA',
    template () {
      return fs.readFileSync('./src/scripts/directives/main-content/index.html', 'utf8');
    },

    link (scope, elem) {
      elem.bind('click', closeNavdrawer);
    },

  };
}

