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

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    sandbox.stub(fs, 'existsSync');
    sandbox.stub(path, 'resolve');

    // package file can never be real
    lib.setPackageConfiguration(pkg);
    lib.setGetComponents(sandbox.stub().returns(['c1', 'clay-c5', 'clay-c3']));
    lib.cache = new _.memoize.Cache();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getComponentPath', function () {
    beforeEach(function () {
      sandbox.stub(process, 'cwd').returns('');

      fs.existsSync.returns(false);
      fs.existsSync.withArgs('components/c1').returns(true);
      fs.existsSync.withArgs('node_modules/clay-c3').returns(true);
      fs.existsSync.withArgs('node_modules/@a/clay-c5').returns(true);
      path.resolve.withArgs(process.cwd(), 'components', 'c1').returns('components/c1');
      path.resolve.withArgs(process.cwd(), 'node_modules', 'clay-c3').returns('node_modules/clay-c3');
      path.resolve.withArgs(process.cwd(), 'node_modules', '@a/clay-c5').returns('node_modules/@a/clay-c5');
    });

    it('returns null if name isn\'t a component', function () {
      expect(lib('c0')).to.equal(null);
    });

    it('gets an internal path', function () {
      expect(lib('c1')).to.equal('components/c1');
    });

    it('gets an npm path', function () {
      expect(lib('clay-c3')).to.equal('node_modules/clay-c3');
    });

    it('gets a scoped npm path', function () {
      expect(lib('clay-c5')).to.equal('node_modules/@a/clay-c5');
    });
  });
});