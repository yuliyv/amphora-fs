'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  lib = require('./' + filename),
  expect = require('chai').expect,
  sinon = require('sinon');

describe(_.startCase(filename), function () {
  let sandbox, fakeLog;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    fakeLog = sandbox.spy();
    lib.setLog(fakeLog);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('memoize', function () {
    let memLeak, clock;
    const fn = lib[this.title];

    beforeEach(function () {
      memLeak = lib.getMemoryLeakThreshold();
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      lib.setMemoryLeakThreshold(memLeak);
      clock.restore();
    });

    it('memoizes', function () {
      const resultFn = fn(function () { return 'd'; });

      resultFn('a', 'b', 'c');

      expect(_.get(resultFn, 'cache.__data__.string.__data__')).to.deep.equal({a: 'd'});
    });

    it('warns when over the limit', function () {
      const resultFn = fn(function namedFn() { return 'd'; });

      lib.setMemoryLeakThreshold(0);

      resultFn('a');
      resultFn('b');
      resultFn('c');

      expect(fakeLog.calledOnce).eql(true);

      clock.tick(60000);
    });
  });
});
