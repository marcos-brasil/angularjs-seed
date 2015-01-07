'use strict';
export var $doc = document;
export var $win = window;
export var $body = $doc.body;

export var angular = $win.angular;
export var queryDom = $doc.querySelector.bind($doc);

export function documentReady (next) {
  if ($doc.readyState === 'complete') { return next(); }

  function _loaded () {
    // after DOM loaded, cleanup
    $doc.removeEventListener('DOMContentLoaded', _loaded, false);
    $win.removeEventListener('load', _loaded, false);
    next();
  }

  // making double sure we get the document load event
  $doc.addEventListener('DOMContentLoaded', _loaded, false);
  $win.addEventListener('load', _loaded, false);
}
