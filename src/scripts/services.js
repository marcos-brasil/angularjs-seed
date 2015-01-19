'use strict';

import {$body as body, angular} from 'globals';

export function $jq () {
  return angular.element;
}

$body.$inject = ['$jq'];
export function $body ($jq) {
  return $jq(body);
}

closeNavdrawer.$inject = ['$state', '$body'];
export function closeNavdrawer ($state, $body) {
  return function closeNavdrawerService () {
    var { appBar, navdrawerContainer } = $state.elements;
    $body.removeClass('open');
    appBar.removeClass('open');
    navdrawerContainer.removeClass('open');
    $state.opened = false;
  };
}

openNavdrawer.$inject = ['$state', '$body'];
export function openNavdrawer ($state, $body) {
  return function openNavdrawerService () {
    var { appBar, navdrawerContainer } = $state.elements;
    $body.toggleClass('open');
    appBar.toggleClass('open');
    navdrawerContainer.toggleClass('open');
    navdrawerContainer.addClass('opened');
    $state.opened = true;
  };
}
