'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  lib = require('./' + filename),
  pkg = require('../../test/fixtures/package.json');

describe(_.startCase(filename), function () {
  var sandbox, getFolders;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    getFolders = sandbox.stub();
    lib.setDeps(getFolders);
    lib.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getComponents', function () {
    it('returns empty array if no components', function () {
      getFolders.returns([]);
      expect(lib({ dependencies: [] })).to.eql([]);
    });

    it('gets a list of internal components', function () {
      getFolders.returns(['c1', 'c2', 'c3']);

      expect(lib(pkg)).to.contain('c1', 'c2');
    });

    it('gets a list of npm components', function () {
      getFolders.returns([]);

      expect(lib(pkg)).to.contain('clay-c3', 'clay-c4');
    });
  });
});
