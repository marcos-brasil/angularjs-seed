// current 6to5 shim doesn't include setImmediate.
// but on v2.0 it will

/* jshint -W030 */

'use strict';

import co from 'co';
import { angular, queryDom, documentReady, $win, $doc, $body } from 'globals';

mocha.setup('bdd');
mocha.reporter('html');

var {expect} = chai;

co(function *() {
  yield new Promise((res, rej) => documentReady(res));
  mocha.run();
});

angular.module('app')
  .directive('testApp', testsApp);



export function testsApp () {
  return {
    restrict: 'E',
    controller: testAppCtrl,
  };
}


function testAppCtrl () {
  describe('basic globals tests', () => {
    it('should be functions', () => {
      expect(queryDom).to.be.instanceof(Function);
      expect(documentReady).to.be.instanceof(Function);
    });

    it('should be objects', () => {
      expect(angular).to.be.instanceof(Object);
      expect($win).to.be.deep.equal(window);
      expect($doc).to.be.deep.equal(document);
      expect($body).to.be.deep.equal(document.body);
    });

    it('should use spy', () => {
      var spy = sinon.spy();
      function tobeSpied (cb) { cb(); cb(); }

      tobeSpied(spy);
      expect(spy).to.have.been.calledTwice;

    });
  });

}



