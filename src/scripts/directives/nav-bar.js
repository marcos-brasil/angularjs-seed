'use strict';

var rand = (Math.random() * Math.pow(10,7)|0).toString(36)
var hrefs = ['/',  'styleguide', 'tests', rand,];
var list = ['Home', 'Style Guide', 'Tests',  `{{rand}}`,];

function iterator (v, k) {
  return `<li><a href="${hrefs[k]}">${v}</a></li>`;
}

navBar.$inject = ['$state', 'closeNavdrawer']
export function navBar ($state, closeNavdrawer) {

  return {
    restrict: 'EA',
    scope: {},
    template: `
      <nav class="navdrawer-container promote-layer">
        <h4>Navigation</h4>
        <ul>
          ${list.map(iterator).join('\n')}
        </ul>
      </nav>
    `,
    controller: ['$scope', ($scope) => $scope.rand = rand],
    link (scope, elem, attr) {
      elem.bind('click', (evt) => {
        if ('/' === evt.target.pathname) {
          // TODO: learn css ng-animation, then use $state.transitionTo
          setImmediate(closeNavdrawer)
        }
      })
    },
  };
}

navdrawerContainer.$inject = ['$state']
export function navdrawerContainer ($state) {
  return {
    restrict: 'C',
    link (scope, elem, attr) {
      $state.elements.navdrawerContainer = elem
    },
  }
}
