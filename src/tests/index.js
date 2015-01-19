// current 6to5 shim doesn't include setImmediate.
// but on v2.0 it will

/* jshint -W030 */

'use strict';
import * as fs from 'fs';

import co from 'co';
import { angular, queryDom, documentReady, $win, $doc, $body } from 'globals';

console.log(fs.readFileSync('./LICENSE', 'utf8'));

// empty module def
angular.module('app', [])

mocha.setup('bdd');
mocha.reporter('html');

var {expect} = chai;

co(function *() {
  yield documentReady;
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
    });

    it('should be Promise', () => {
      expect(documentReady).to.be.instanceof(Promise);
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



