'use strict';
export var $doc = document;
export var $win = window;
export var $body = $doc.body;

export var angular = $win.angular;
export var queryDom = $doc.querySelector.bind($doc);

export var documentReady = new Promise((resolve, reject) => {
  if ($doc.readyState === 'complete') { return resolve(); }

  function loaded () {
    // after DOM loaded, cleanup
    $doc.removeEventListener('DOMContentLoaded', loaded, false);
    $win.removeEventListener('load', loaded, false);
    resolve();
  }

  // making double sure we get the document load event
  $doc.addEventListener('DOMContentLoaded', loaded, false);
  $win.addEventListener('load', loaded, false);
});
