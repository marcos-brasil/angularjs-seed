// current 6to5 shim doesn't include setImmediate.
// but on v2.0 it will

/* jshint -W030 */

'use strict';

import { readFileSync } from 'fs';
console.log(readFileSync('./LICENSE', 'utf8'));

mocha.setup('bdd');
mocha.reporter('html');

var {expect} = chai;

import { main } from '../scripts/main';
import { close } from '../scripts/close';
import { toggle } from '../scripts/toggle';

describe('basic tests', () => {
  it('should be functions', () => {
    expect(main).to.be.instanceof(Function);
    expect(close).to.be.instanceof(Function);
    expect(toggle).to.be.instanceof(Function);
  });

  it('should use spy', () => {
    var spy = sinon.spy();
    function tobeSpied (cb) { cb(); cb(); }

    tobeSpied(spy);
    expect(spy).to.have.been.calledTwice;

  });
});


mocha.run();
