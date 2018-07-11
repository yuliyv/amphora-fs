'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  lib = require('./' + filename);

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

  describe('getLayouts', function () {
    it('returns empty array if no layouts', function () {
      getFolders.returns([]);
      expect(lib()).to.eql([]);
    });

    it('gets a list of internal layouts', function () {
      getFolders.returns(['c1']);

      expect(lib()).to.eql(['c1']);
    });
  });
});
