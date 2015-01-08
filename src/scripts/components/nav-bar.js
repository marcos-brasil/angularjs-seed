'use strict';

export function navBar () {
  var hrefs = ['hello',  'styleguide', 'tests', '/',];
  var list = ['Hello', 'Style Guide', 'Tests',  `{{rand}}`,];

  function iterator (v, k) {
    return `<li><a href="${hrefs[k]}">${v}</a></li>`;
  }

  return {
    restrict: 'E',
    template: `
      <nav class="navdrawer-container promote-layer">
        <h4>Navigation</h4>
        <ul>
          ${list.map(iterator).join('\n')}
        </ul>
      </nav>
      `,
    controller: ['$scope', ($scope) => $scope.rand = Math.random()]
  };
}
