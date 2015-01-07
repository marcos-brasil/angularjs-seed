'use strict';

export function navBar () {
  var hrefs = ['#hello',  'styleguide', '/',];
  var list = ['Hello', 'Style Guide', `${Math.random()}`,];

  function iterator (v, k) {
    return `<li><a href="${hrefs[k]}">${v}</a></li>`;
  }

  return {
    template:  `
      <nav class="navdrawer-container promote-layer">
        <h4>Navigation</h4>
        <ul>
          ${list.map(iterator).join('\n')}
        </ul>
      </nav>
      `,
    restrict: 'E',
  };
}
