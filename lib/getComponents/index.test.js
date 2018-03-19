'use strict';

const _ = require('lodash'),
  filename = __filename.split('/').pop().split('.').shift(),
  expect = require('chai').expect,
  sinon = require('sinon'),
  fs = require('fs'),
  path = require('path'),
  lib = require('./' + filename),
  pkg = require('../../test/fixtures/package.json');

describe(_.startCase(filename), function () {
  var sandbox;

  function createMockStat(options) {
    return {
      isDirectory: _.constant(!!options.isDirectory)
    };
  }

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs);
    lib.cache = new _.memoize.Cache();

    // package file can never be real
    lib.setPackageConfiguration(pkg);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getComponents', function () {
    it('gets a list of internal components', function () {
      fs.readdirSync.withArgs(path.join(process.cwd(), 'components')).returns(['c1', 'c2']);
      fs.statSync.withArgs(path.join(process.cwd(), 'components/c1')).returns(createMockStat({isDirectory: true}));
      fs.statSync.withArgs(path.join(process.cwd(), 'components/c2')).returns(createMockStat({isDirectory: false}));

      expect(lib()).to.contain('c1', 'c2');
    });

    it('gets a list of npm components', function () {
      fs.readdirSync.withArgs('components').returns([]);
      sandbox.stub(path, 'resolve').returnsArg(0);

      expect(lib()).to.contain('clay-c3', 'clay-c4');
    });
  });
});
